module.exports = {
    "env": {
        "commonjs": true,
        "es6": true,
        "node": true,
        "browser": true
    },
    "extends": [
        'plugin:@typescript-eslint/recommended',
    ],
    "parser":  '@typescript-eslint/parser',
    "parserOptions": {
        "ecmaVersion": 2017,
        "sourceType": "module"
    },

    "plugins": [
        "html",
        "svelte3"
    ],
    "settings": {
        "svelte3/ignore-styles": true,
        "html": {
            "indent": 0,
            "report-bad-indent": "error",
            "html-extensions": [
                ".html"
            ]
        }
    },

    "rules": {
        "indent": [
            "error",
            4
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "never"
        ]
    }
}