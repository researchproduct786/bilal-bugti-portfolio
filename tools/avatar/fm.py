import mediapipe as mp, cv2, numpy as np, json, sys
img = cv2.imread('/tmp/arena-coding-uploads/eb6fd55d-9005-42c6-a2dd-127815fd65a7.png'); h,w = img.shape[:2]; print(w,h)
fm = mp.solutions.face_mesh.FaceMesh(static_image_mode=True, refine_landmarks=True, max_num_faces=1, min_detection_confidence=0.3)
r = fm.process(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
print('faces', 0 if not r.multi_face_landmarks else len(r.multi_face_landmarks))
lm = r.multi_face_landmarks[0].landmark
P = np.array([[l.x*w, l.y*h, l.z*w] for l in lm]); np.save('lm.npy', P)
print(P.shape, P.min(0), P.max(0))
tris = sorted(set()) 
