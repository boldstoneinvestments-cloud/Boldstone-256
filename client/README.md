# React + Vite

## Account reCAPTCHA

The account sign-in and sign-up forms use a reCAPTCHA checkbox. Add the public site key as the GitHub Actions repository variable `VITE_RECAPTCHA_SITE_KEY`; the `Boldstone CI` workflow injects it during the Pages build. Keep the matching `RECAPTCHA_SECRET_KEY` only in the backend Railway service variables. The public site key must be authorized for `boldstoneinvestments.com` and `www.boldstoneinvestments.com`.

## Shop product image uploads

The admin product editor accepts an image URL or uploads directly to Cloudinary. Configure the GitHub Actions repository variables `VITE_CLOUDINARY_CLOUD_NAME` and `VITE_CLOUDINARY_UPLOAD_PRESET` to enable uploads. The preset must be unsigned and restricted to image uploads with an appropriate size limit; no Cloudinary API secret belongs in frontend variables.

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
