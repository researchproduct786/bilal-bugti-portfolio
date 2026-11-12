"""Builds the personal avatar head (GLB) from one reference photograph.
Pipeline: MediaPipe FaceMesh landmarks -> similarity-align to a generic face -> thin-plate-spline
warp of the ICT-FaceKit neutral head (MIT) -> photo projected into the head's UV atlas -> procedural hair.
The photograph never leaves this machine; only the derived mesh + baked texture are exported."""
import numpy as np, cv2, json, struct, sys, math
from scipy.spatial import cKDTree
from scipy.interpolate import RBFInterpolator
import mediapipe as mp
rng = np.random.default_rng(7)
PHOTO = sys.argv[1]; OUT = sys.argv[2]
ZS = float(sys.argv[3]) if len(sys.argv) > 3 else 0.75   # trust in monocular depth

# ---------- load ICT
V=[];VT=[];F=[]
for l in open('ict/FaceXModel/generic_neutral_mesh.obj'):
    if l.startswith('v '): V.append(list(map(float,l.split()[1:4])))
    elif l.startswith('vt '): VT.append(list(map(float,l.split()[1:3])))
    elif l.startswith('f '): F.append([tuple(int(x) for x in p.split('/')[:2]) for p in l.split()[1:]])
V=np.array(V); VT=np.array(VT)
def tris_for(p0,p1):
    out=[]
    for f in F[p0:p1+1]:
        for k in range(1,len(f)-1): out.append((f[0],f[k],f[k+1]))
    a=np.array(out); return a[:,:,0]-1, a[:,:,1]-1     # vertex idx, uv idx
GROUPS={'skin':(0,11143),'sockL':(13226,13629),'sockR':(13630,14033),'eyeL':(21496,23093),'eyeR':(23094,24691)}
G={k:tris_for(*v) for k,v in GROUPS.items()}

# ---------- canonical mediapipe face -> ICT space (similarity ICP)
C=np.array([list(map(float,l.split()[1:4])) for l in open('canon.obj') if l.startswith('v ')])
def umeyama(A,B,scale=True):
    ma,mb=A.mean(0),B.mean(0); A0,B0=A-ma,B-mb
    U,S,Vt=np.linalg.svd(B0.T@A0/len(A)); D=np.eye(3)
    if np.linalg.det(U@Vt)<0: D[2,2]=-1
    R=U@D@Vt; s=(S*np.diag(D)).sum()/A0.var(0).sum() if scale else 1.0
    return s,R,mb-s*R@ma
face=V[:6706]; tree=cKDTree(face)
Cc=C+ (face[face[:,2].argmax()]-C[C[:,2].argmax()])
for it in range(40):
    d,i=tree.query(Cc); keep=d<np.percentile(d,80)
    s,R,t=umeyama(Cc[keep],face[i[keep]]); Cc=(s*(R@Cc.T)).T+t
print('ICP residual cm', np.median(tree.query(Cc)[0]))

# ---------- landmarks from the photograph
img=cv2.imread(PHOTO); H,W=img.shape[:2]
fm=mp.solutions.face_mesh.FaceMesh(static_image_mode=True,refine_landmarks=True,max_num_faces=1,min_detection_confidence=0.3)
lm=fm.process(cv2.cvtColor(img,cv2.COLOR_BGR2RGB)).multi_face_landmarks[0].landmark
P=np.array([[l.x*W,l.y*H,l.z*W] for l in lm]); U=np.stack([P[:468,0],-P[:468,1],-P[:468,2]],1)
s,R,t=umeyama(U,Cc); T=(s*(R@U.T)).T+t
print('photo scale cm/px',s,'head rot deg',np.degrees(np.arccos((np.trace(R)-1)/2)))
def to_px(X):      # ICT-space point -> photo pixel
    u=((X-t)@R)/s; return np.stack([u[:,0],-u[:,1]],1)
D=T-Cc
# depth from a single image is the weakest signal: damp it
D[:,2]*=ZS
# global anisotropic scale so skull/ears/neck follow the face proportions
sc=np.array([np.ptp(T[:,k])/np.ptp(Cc[:,k]) for k in range(3)]); sc[2]=(sc[0]+sc[1])/2
ctr=Cc.mean(0)
def glob(X): return (X-ctr)*sc+ctr
Dres=T-glob(Cc); Dres[:,2]*=ZS

# exact contour constraints: eyelid rims and inner lips of the head mesh must land on the photo's contours
ft=tris_for(0,9229)[0]; ed={}
for tr in ft:
    for a,b in ((tr[0],tr[1]),(tr[1],tr[2]),(tr[2],tr[0])): ed[(min(a,b),max(a,b))]=ed.get((min(a,b),max(a,b)),0)+1
bnd=[e for e,c in ed.items() if c==1]; adj={}
for a,b in bnd: adj.setdefault(a,[]).append(b); adj.setdefault(b,[]).append(a)
loops=[];seen=set()
for st in adj:
    if st in seen: continue
    lp=[st];seen.add(st);cur=st
    while True:
        nx=[n for n in adj[cur] if n not in seen]
        if not nx: break
        cur=nx[0];seen.add(cur);lp.append(cur)
    loops.append(np.array(lp))
RIM={};LOOPS={}
CONT={'eyeR':[33,7,163,144,145,153,154,155,133,173,157,158,159,160,161,246],'eyeL':[263,249,390,373,374,380,381,382,362,398,384,385,386,387,388,466]}
xc=[];xd=[];used_lm=[]
for nm,idx in CONT.items():
    tgt=T[idx]; c_src=Cc[idx].mean(0)
    lp=min([l for l in loops if len(l)<400],key=lambda l:np.linalg.norm(V[l].mean(0)-c_src))
    print(nm,'loop',len(lp),'dist',np.linalg.norm(V[lp].mean(0)-c_src))
    lc=V[lp].mean(0); tc=tgt.mean(0)
    # normalised angle param: compare angles after scaling each contour to unit extents
    def ang(Pts,c):
        d=(Pts-c)[:,:2]; d=d/ (np.abs(d).max(0)+1e-9); return np.arctan2(d[:,1],d[:,0])
    al=ang(V[lp],lc); at=ang(tgt,tc); o=np.argsort(at); at=at[o]; tg=tgt[o]
    at=np.concatenate([at[-1:]-2*np.pi,at,at[:1]+2*np.pi]); tg=np.concatenate([tg[-1:],tg,tg[:1]])
    tp=np.stack([np.interp(al,at,tg[:,k]) for k in range(3)],1)
    xc.append(V[lp]); xd.append(tp-glob(V[lp])); used_lm+=idx; RIM[nm]=tp; LOOPS[nm]=lp
keepc=np.setdiff1d(np.arange(468),used_lm); _rt=cKDTree(np.concatenate(xc)); keepc=keepc[_rt.query(Cc[keepc])[0]>0.9]
xd=np.concatenate(xd); xd[:,2]*=ZS
CTRL=np.concatenate([Cc[keepc]]+xc); DISP=np.concatenate([Dres[keepc],xd])
_,ui=np.unique(np.round(CTRL,3),axis=0,return_index=True); CTRL=CTRL[ui]; DISP=DISP[ui]
rbf=RBFInterpolator(CTRL,DISP,kernel='thin_plate_spline',smoothing=0.02)
ctree=cKDTree(CTRL)
def warp(X):
    d,_=ctree.query(X); w=np.clip(1-(d-1.5)/6.0,0,1); w=w*w*(3-2*w)
    return glob(X)+rbf(X)*w[:,None]
NV=warp(V[:14062]) ; Vn=V.copy(); Vn[:14062]=NV
for nm in RIM: print(nm,'rim err cm',np.abs(NV[LOOPS[nm]]-RIM[nm]).mean(0), 'open h',np.ptp(RIM[nm][:,1]),'w',np.ptp(RIM[nm][:,0]))
Ui=np.stack([P[468:,0],-P[468:,1],-P[468:,2]],1); Ti=(s*(R@Ui.T)).T+t      # iris landmarks
EYE={}
for (a,b),nm,ii in (((21451,23021),'eyeL',5),((23021,24591),'eyeR',0)):
    c0=V[a:b].mean(0); r0=np.linalg.norm(V[a:b]-c0,axis=1).max(); rim=RIM[nm]
    # iris landmark set 468.. belongs to the eye whose rim centre is closest
    cand=[Ti[0],Ti[5]]; irc=min(cand,key=lambda q:np.linalg.norm(q[:2]-rim.mean(0)[:2]))
    Rn=r0*(sc[0]+sc[1])/2; c=np.array([rim[:,0].mean(),rim[:,1].mean(),rim[:,2].mean()-Rn*0.80])
    Vn[a:b]=(V[a:b]-c0)*(Rn/r0)+c
    d=irc[:2]-c[:2]; ax=np.array([d[0],d[1],math.sqrt(max(Rn*Rn-d@d,1e-6))]); EYE[nm]=(c,Rn,ax/np.linalg.norm(ax))
print('scale',sc)

# ---------- normals
def normals(Vx,tri):
    n=np.zeros_like(Vx); fn=np.cross(Vx[tri[:,1]]-Vx[tri[:,0]],Vx[tri[:,2]]-Vx[tri[:,0]])
    for k in range(3): np.add.at(n,tri[:,k],fn)
    return n/(np.linalg.norm(n,axis=1,keepdims=True)+1e-9)
alltri=np.concatenate([G[k][0] for k in G]); N=normals(Vn,alltri)

# ---------- texture bake (atlas: skin tile 0 -> left 2/3 ; eyes -> right column)
TS=2048; tex=np.zeros((TS,TS,3),np.float32); cov=np.zeros((TS,TS),bool)
hull=cv2.convexHull(P[:468,:2].astype(np.float32)); mask=np.zeros((H,W),np.float32); cv2.fillConvexPoly(mask,hull.astype(np.int32),1.0)
mask=cv2.erode(mask,np.ones((9,9))); mask=cv2.GaussianBlur(mask,(0,0),9)
imgf=img.astype(np.float32)
# base skin tone: cheeks + forehead samples
samp=np.concatenate([P[[50,280,205,425,117,346,187,411,36,266,101,330],:2]])
tone=np.median(np.array([imgf[int(y)-6:int(y)+6,int(x)-6:int(x)+6].reshape(-1,3) for x,y in samp]).reshape(-1,3),0)
print('skin tone BGR',tone)
view=R@np.array([0,0,1.0])       # direction toward the camera, in ICT space
def uvmap(name,uv):
    uv=uv.copy(); til=np.floor(uv[:,0].min()+1e-6); uv[:,0]-=til
    if name=='skin' or name.startswith('sock'): return uv*np.array([1,1])
    return uv
ATLAS={}
def place(name,uvs):
    u=uvs.copy(); u[:,0]-=np.floor(u[:,0].min()+1e-6)
    if name in('eyeL','eyeR'):
        mn,mx=u.min(0),u.max(0); u=(u-mn)/(mx-mn)*0.20+np.array([0.78,0.05 if name=='eyeL' else 0.30])
    elif name in('sockL','sockR'):
        mn,mx=u.min(0),u.max(0); u=(u-mn)/(mx-mn)*0.08+np.array([0.80,0.56 if name=='sockL' else 0.66])
    else: u=u*np.array([0.75,1.0])
    return u
def bake(name):
    tv,tu=G[name]; uvs=place(name,VT)   # VT indexed by uv idx
    ATLAS[name]=uvs
    for a in range(len(tv)):
        p=uvs[tu[a]]*TS; x0,y0=np.floor(p.min(0)).astype(int)-1; x1,y1=np.ceil(p.max(0)).astype(int)+1
        x0=max(x0,0);y0=max(y0,0);x1=min(x1,TS-1);y1=min(y1,TS-1)
        if x1<x0 or y1<y0: continue
        xs,ys=np.meshgrid(np.arange(x0,x1+1)+.5,np.arange(y0,y1+1)+.5)
        d=(p[1,1]-p[2,1])*(p[0,0]-p[2,0])+(p[2,0]-p[1,0])*(p[0,1]-p[2,1])
        if abs(d)<1e-9: continue
        w0=((p[1,1]-p[2,1])*(xs-p[2,0])+(p[2,0]-p[1,0])*(ys-p[2,1]))/d
        w1=((p[2,1]-p[0,1])*(xs-p[2,0])+(p[0,0]-p[2,0])*(ys-p[2,1]))/d; w2=1-w0-w1
        m=(w0>=-0.35)&(w1>=-0.35)&(w2>=-0.35)      # dilated a little to hide seams
        if not m.any(): continue
        inside=(w0>=0)&(w1>=0)&(w2>=0)
        X=w0[...,None]*Vn[tv[a,0]]+w1[...,None]*Vn[tv[a,1]]+w2[...,None]*Vn[tv[a,2]]
        Nn=w0[...,None]*N[tv[a,0]]+w1[...,None]*N[tv[a,1]]+w2[...,None]*N[tv[a,2]]
        px=to_px(X.reshape(-1,3)).reshape(X.shape[0],X.shape[1],2).astype(np.float32)
        col=cv2.remap(imgf,px[...,0],px[...,1],cv2.INTER_LINEAR,borderMode=cv2.BORDER_REPLICATE)
        mk=cv2.remap(mask,px[...,0],px[...,1],cv2.INTER_LINEAR,borderMode=cv2.BORDER_CONSTANT)
        facing=np.clip(((Nn@view)-0.12)/0.38,0,1)
        if name.startswith('eye'): wgt=np.zeros_like(mk); base=np.array([214,218,224],np.float32)
        elif name.startswith('sock'): wgt=np.zeros_like(mk); base=tone*0.45
        else: wgt=facing*mk; base=tone
        out=col*wgt[...,None]+base*(1-wgt[...,None])
        sel=m&(inside|~cov[y0:y1+1,x0:x1+1]); ty,tx=np.nonzero(sel)
        tex[1*(TS-1-(ty+y0)),tx+x0]=out[ty,tx]; cov[y0:y1+1,x0:x1+1]|=sel
    
for k in G: bake(k)
tex[~cov[::-1]]=tone
# gentle variation in the plain areas is supplied in-shader; soften acne-level noise slightly, keep features
texs=cv2.bilateralFilter(tex,7,18,5); tex=tex*0.45+texs*0.55
cv2.imwrite(OUT+'/skin.jpg',np.clip(tex,0,255).astype(np.uint8),[cv2.IMWRITE_JPEG_QUALITY,90])

# ---------- hair (procedural clumps grown from the scalp)
skinV=np.unique(G['skin'][0]); 
top=T[10]; chin=T[152]; earL=T[234]; earR=T[454]; brow=T[9]
ymax=Vn[skinV,1].max(); zmin=Vn[skinV,2].min(); zf=top[2]
def hairline(p):      # y below which there is no hair, as a function of position
    z=p[:,2]; x=np.abs(p[:,0]); tz=np.clip((zf-z)/(zf-zmin),0,1)
    front=top[1]-0.5+ (np.clip(x/ (abs(earL[0]-earR[0])/2),0,1)**2)*-1.2      # dips at the temples
    back=earL[1]-3.2
    side=earL[1]+1.4
    y=np.where(tz<0.45, front+(side-front)*np.clip(tz/0.45,0,1)**1.5, side+(back-side)*np.clip((tz-0.45)/0.3,0,1))
    return y
tv=G['skin'][0]; cen=Vn[tv].mean(1); hl=hairline(cen); scalp=tv[cen[:,1]>hl]
area=np.linalg.norm(np.cross(Vn[scalp[:,1]]-Vn[scalp[:,0]],Vn[scalp[:,2]]-Vn[scalp[:,0]]),axis=1)
HV=[];HN=[];HC=[];HI=[]
def add_clump(root,nrm,dirn,length,width,curl,shade):
    seg=6; pts=[];p=root.copy(); d=dirn/np.linalg.norm(dirn)
    side=np.cross(d,nrm); side/= (np.linalg.norm(side)+1e-9)
    for k in range(seg+1):
        pts.append(p.copy()); d=d+curl*(k/seg)+np.array([0,-0.035*k,0]); d/=np.linalg.norm(d); p=p+d*length/seg
    base=len(HV)
    for k,pt in enumerate(pts):
        tt=k/seg; w=width*(1-tt)**0.7*(0.55+0.45*math.sin(min(tt*3.2,1.57))) ; 
        tang=(pts[min(k+1,seg)]-pts[max(k-1,0)]); tang/=np.linalg.norm(tang)+1e-9
        b1=np.cross(tang,nrm); b1/=np.linalg.norm(b1)+1e-9; b2=np.cross(tang,b1)
        for a in range(4):
            ang=a*math.pi/2+0.6; o=(math.cos(ang)*b1+math.sin(ang)*b2*0.55)
            HV.append(pt+o*w); HN.append(o/np.linalg.norm(o)); c=shade*(0.55+0.75*tt); HC.append([c,c*0.96,c*0.92])
    for k in range(seg):
        for a in range(4):
            i0=base+k*4+a; i1=base+k*4+(a+1)%4; HI.append([i0,i1,i0+4]); HI.append([i1,i1+4,i0+4])
n_cl=1450; pick=rng.choice(len(scalp),n_cl,p=area/area.sum())
headc=np.array([0,(ymax+earL[1])/2,(zf+zmin)/2]); halfw=abs(earL[0]-earR[0])/2
def lock(root,nrm,dirn,length,width,wave,phase,shade,lift,seg=8,ns=5):
    pts=[];p=root.copy(); d=dirn/np.linalg.norm(dirn); sidev=np.cross(d,nrm); sidev/=np.linalg.norm(sidev)+1e-9
    for k in range(seg+1):
        tt=k/seg; pts.append(p.copy())
        d=d+sidev*wave*math.cos(phase+tt*5.2)*0.42+nrm*lift*(0.5-tt)*0.5+np.array([0,-0.05*tt,0]); d/=np.linalg.norm(d); p=p+d*length/seg
    base=len(HV)
    for k,pt in enumerate(pts):
        tt=k/seg; w=width*(0.35+0.65*math.sin(min(0.25+tt*2.6,1.57)))*(1-tt**2.2*0.92)
        tang=(pts[min(k+1,seg)]-pts[max(k-1,0)]); tang/=np.linalg.norm(tang)+1e-9
        b1=np.cross(tang,nrm); b1/=np.linalg.norm(b1)+1e-9; b2=np.cross(tang,b1)
        for a_ in range(ns):
            an=a_*2*math.pi/ns; o=(math.cos(an)*b1+math.sin(an)*b2*0.42)
            HV.append(pt+o*w); n_=math.cos(an)*b1*0.6+math.sin(an)*b2; HN.append(n_/np.linalg.norm(n_)); c=shade*(0.5+0.6*tt)*(0.8+0.2*math.cos(an*3+phase)); HC.append([c,c*0.95,c*0.9])
    for k in range(seg):
        for a_ in range(ns):
            i0=base+k*ns+a_; i1=base+k*ns+(a_+1)%ns; HI.append([i0,i1,i0+ns]); HI.append([i1,i1+ns,i0+ns])
for ti in pick:
    bb=rng.dirichlet([1,1,1]); tr=scalp[ti]; root=bb@Vn[tr]; nrm=bb@N[tr]; nrm/=np.linalg.norm(nrm)
    topness=np.clip(nrm[1]*1.25+0.1,0,1)                                  # 1 on the crown, 0 on the sides/back
    frontness=np.clip((root[2]-headc[2])/(zf-headc[2]),-1,1); sidex=root[0]/halfw
    if topness>0.42 or (frontness>0.55 and abs(sidex)<0.75):
        # the top: long locks rising from the hairline, swept up-and-back with a slight sideways part
        flow=np.array([0.38+0.25*sidex,0.9,-0.25+0.5*max(frontness,0)])
        dirn=nrm*0.55+flow*0.95+rng.normal(0,0.22,3); length=rng.uniform(4.2,6.6)*(0.85+0.3*max(frontness,0)); width=rng.uniform(0.7,1.15)
        lock(root-nrm*0.2,nrm,dirn,length,width,rng.uniform(0.5,1.0),rng.uniform(0,6.28),rng.uniform(0.55,1.0),0.5)
    else:
        down=np.array([0,-1.0,-0.35]); tang=down-nrm*(down@nrm); tang/=np.linalg.norm(tang)+1e-9
        dirn=tang+rng.normal(0,0.12,3)-nrm*0.05; length=rng.uniform(0.9,1.7)*(1+0.9*topness); width=rng.uniform(0.28,0.5)
        lock(root-nrm*0.1,nrm,dirn,length,width,rng.uniform(0.1,0.3),rng.uniform(0,6.28),rng.uniform(0.5,0.9),-0.25,4,3)
# under-cap so no scalp shows between clumps
capv=np.unique(scalp); remap={v:i for i,v in enumerate(capv)}; b0=len(HV)
for v in capv:
    dd=float(np.clip((Vn[v,1]-hairline(Vn[v][None])[0])/2.0,0,1)); HV.append(Vn[v]+N[v]*(0.06+0.5*dd)); HN.append(N[v]); HC.append([0.45,0.43,0.41])
for tr in scalp: HI.append([b0+remap[tr[0]],b0+remap[tr[1]],b0+remap[tr[2]]])
HV=np.array(HV);HN=np.array(HN);HC=np.array(HC);HI=np.array(HI)
print('hair verts',len(HV),'tris',len(HI))

# ---------- export GLB (metres, origin at base of neck)
neck=Vn[skinV]; base_y=neck[:,1].min(); org=np.array([0,base_y,neck[neck[:,1]<base_y+1.5][:,2].mean()])
def prim(name):
    tv,tu=G[name]; key=tv.astype(np.int64)*100000+tu; uq,inv=np.unique(key.reshape(-1),return_inverse=True)
    vi=(uq//100000).astype(int); ui=(uq%100000).astype(int); uv=ATLAS[name][ui].copy(); uv[:,1]=1-uv[:,1]
    return (Vn[vi]-org)*0.01, N[vi], uv, inv.reshape(-1,3)
blob=bytearray(); views=[]; accs=[]
def push(arr,target,ctype,atype,minmax=False):
    global blob
    while len(blob)%4: blob.append(0)
    b=arr.tobytes(); views.append({'buffer':0,'byteOffset':len(blob),'byteLength':len(b),**({'target':target} if target else {})}); blob+=b
    a={'bufferView':len(views)-1,'componentType':ctype,'count':len(arr),'type':atype}
    if minmax: a['min']=arr.min(0).tolist(); a['max']=arr.max(0).tolist()
    accs.append(a); return len(accs)-1
meshes=[];nodes=[]
def add_mesh(name,P_,N_,UV,I,mat,COL=None):
    at={'POSITION':push(P_.astype(np.float32),34962,5126,'VEC3',True),'NORMAL':push(N_.astype(np.float32),34962,5126,'VEC3')}
    if UV is not None: at['TEXCOORD_0']=push(UV.astype(np.float32),34962,5126,'VEC2')
    if COL is not None:
        c4=np.concatenate([np.clip(COL,0,1),np.ones((len(COL),1))],1); at['COLOR_0']=push((c4*255).astype(np.uint8),34962,5121,'VEC4'); accs[-1]['normalized']=True
    idx=push(I.astype(np.uint32).reshape(-1),34963,5125,'SCALAR')
    meshes.append({'name':name,'primitives':[{'attributes':at,'indices':idx,'material':mat}]}); nodes.append({'name':name,'mesh':len(meshes)-1})
# skin + sockets merged
parts=[prim(k) for k in ('skin','sockL','sockR')]; off=0;Ps=[];Ns=[];Us=[];Is=[]
for p_,n_,u_,i_ in parts: Ps.append(p_);Ns.append(n_);Us.append(u_);Is.append(i_+off); off+=len(p_)
add_mesh('Skin',np.concatenate(Ps),np.concatenate(Ns),np.concatenate(Us),np.concatenate(Is),0)
parts=[prim(k) for k in ('eyeL','eyeR')]; off=0;Ps=[];Ns=[];Us=[];Is=[]
for p_,n_,u_,i_ in parts: Ps.append(p_);Ns.append(n_);Us.append(u_);Is.append(i_+off); off+=len(p_)

# iris/pupil painted per vertex from the distance to each eye's forward axis
EP=np.concatenate(Ps); EC=np.ones((len(EP),3))*np.array([0.80,0.78,0.76])
for nm in ('eyeL','eyeR'):
    c,Rn,ax=EYE[nm]; c=(c-org)*0.01; Rn*=0.01; d=EP-c; m=np.linalg.norm(d,axis=1)<Rn*1.25
    rr=np.linalg.norm(d-np.outer(d@ax,ax),axis=1); fr=(d@ax)>0; ir=Rn*0.43
    EC[m&fr&(rr<ir*1.1)]=[0.04,0.028,0.022]; EC[m&fr&(rr<ir)]=[0.055,0.028,0.015]; EC[m&fr&(rr<ir*0.40)]=[0.004,0.004,0.004]
add_mesh('Eyes',EP,np.concatenate(Ns),None,np.concatenate(Is),1,EC)
add_mesh('Hair',(HV-org)*0.01,HN,None,HI,2,HC)
jpg=open(OUT+'/skin.jpg','rb').read()
while len(blob)%4: blob.append(0)
views.append({'buffer':0,'byteOffset':len(blob),'byteLength':len(jpg)}); blob+=jpg
while len(blob)%4: blob.append(0)
meta={'earL':((Vn[skinV][Vn[skinV,0].argmin()]-org)*0.01).tolist(),'top':float((HV[:,1].max()-org[1])*0.01),'eyeY':float(((T[468-1+0*0][1] if False else T[168][1])-org[1])*0.01),'chin':((T[152]-org)*0.01).tolist(),'nose':((T[1]-org)*0.01).tolist()}
gltf={'asset':{'version':'2.0','generator':'bilal-avatar-builder'},'scene':0,'scenes':[{'nodes':[len(nodes)]}],
 'nodes':nodes+[{'name':'AvatarHead','children':list(range(len(nodes))),'extras':meta}],'meshes':meshes,
 'materials':[{'name':'Skin','pbrMetallicRoughness':{'baseColorTexture':{'index':0},'metallicFactor':0,'roughnessFactor':0.62}},
              {'name':'Eyes','pbrMetallicRoughness':{'metallicFactor':0,'roughnessFactor':0.12}},
              {'name':'Hair','pbrMetallicRoughness':{'baseColorFactor':[0.035,0.03,0.03,1],'metallicFactor':0,'roughnessFactor':0.72},'doubleSided':True}],
 'textures':[{'source':0,'sampler':0}],'samplers':[{'magFilter':9729,'minFilter':9987,'wrapS':33071,'wrapT':33071}],
 'images':[{'bufferView':len(views)-1,'mimeType':'image/jpeg'}],'buffers':[{'byteLength':len(blob)}],'bufferViews':views,'accessors':accs}
js=json.dumps(gltf,separators=(',',':')).encode(); js+=b' '*((4-len(js)%4)%4)
with open(OUT+'/avatar.glb','wb') as f:
    f.write(struct.pack('<4sII',b'glTF',2,12+8+len(js)+8+len(blob))); f.write(struct.pack('<I4s',len(js),b'JSON')); f.write(js); f.write(struct.pack('<I4s',len(blob),b'BIN\0')); f.write(blob)
print('glb bytes',12+16+len(js)+len(blob), meta)
