# MRI Fourier Lab

An interactive, dependency-free web app for learning how a 2D Fourier transform decomposes a grayscale image into spatial frequencies—the core mathematical idea behind reconstructing MRI k-space measurements.

## Run it

Open `index.html` in a modern browser. No installation or build step is required.

## Try it

1. Upload an image (it stays in your browser).
2. Inspect the log-scaled, centred Fourier magnitude spectrum.
3. Move the slider to retain more or fewer of the strongest coefficients.
4. Compare the inverse-transform reconstruction with the source.

## What this teaches

- Pixels describe intensity in space.
- Fourier coefficients describe amplitude and phase of spatial-frequency patterns.
- Low frequencies carry broad structure; high frequencies contribute edges and detail.
- MRI scanners sample complex-valued spatial-frequency data called **k-space**, then reconstruct an image using an inverse Fourier transform.

This simplified demo ranks coefficients by magnitude. Clinical MRI reconstruction additionally involves sampling trajectories, receiver coils, noise, calibration, corrections, and often more advanced reconstruction methods.

## Scope

Educational software only. This project does not process MRI scanner data and is not a medical device.

## License

MIT
