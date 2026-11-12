# Avatar pipeline

Builds the head used in the home-page studio (`public/avatar/head.glb`) from **one frontal photograph**.
The photograph is never committed; only the derived model is.

## What it does (`build.py`)

1. Detects 468 facial landmarks in the photo (MediaPipe Face Mesh; helper in `fm.py`).
2. Takes the neutral mesh from ICT-FaceKit and aligns it to the landmarks (ICP, then a similarity transform).
3. Warps the mesh onto the landmarks with a thin-plate-spline RBF (smoothing 0.02, depth scaled by 0.75; eyelid loops are constrained so the eyes stay open).
4. Projects the photo onto the mesh's texture atlas; builds procedural eyes; grows about 1,450 hair locks over a scalp cap.
5. Writes a GLB with three nodes: `Skin`, `Eyes`, `Hair`.

## Running it

```bash
python3 -m venv v && v/bin/pip install numpy opencv-contrib-python-headless mediapipe scipy
git clone --depth 1 --filter=blob:none --sparse https://github.com/ICT-VGL/ICT-FaceKit ict   # sparse: FaceXModel is ~390 MB
v/bin/python build.py /path/to/photo.jpg out/
npx -y @gltf-transform/cli@4 optimize out/avatar.glb ../../public/avatar/head.glb --compress meshopt --texture-compress webp --texture-size 1024
```

The compressed file is about 0.7 MB. Meshopt quantises vertex positions and adds a node transform, so any shader that
reads positions must go through the `uToHead` matrix (see `src/three/studio.ts`).

## Limits — read before judging the likeness

- One photo gives the front of the face only. Profile, ears, skull shape and hair are estimated, so the head is a
  **likeness, not a scan**. It is captioned that way on the site.
- Hair is procedural and reads as stylised. Two or three more photos (left, right, three-quarter) would improve the
  profile and hairline more than any amount of tuning.
- Things that were tried and made it worse: projecting the photo onto the eyeballs, heavier TPS smoothing (≥ 0.3),
  constraining the inner lip contour, and more than ~1,500 hair locks (file size).
