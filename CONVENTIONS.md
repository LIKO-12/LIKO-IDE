
# Conventions followed in this codebase

## Files hierarchy

- `/src/`: Contains the source-code of the whole application.
    - `./editors/`: Contains a directory for each editor.
        - `./<editor>/`: The directory of an editor (`code`, `image`, ...).
            - `./components/`: Any `.tsx` file with react components lives here.
                - `./<editor>-editor.tsx`: The root element of the editor.
            - `./lib/`: Any `.ts` file with code reused in the editor itself.
            - `./styles/`: The stylesheets for the editor components.

## Filenames

- Use `kebab-case` for all filenames.
