# Kecap

![Logo](./social_preview.png)

> Keyboard-driven Carousel Component Provider

[![npm](https://img.shields.io/npm/v/kecap.svg?style=flat-square)](https://www.npmjs.com/package/kecap) [![npm](https://img.shields.io/npm/dt/kecap.svg?style=flat-square)](https://www.npmjs.com/package/kecap)

Developed with Typescript and [Custom Elements API](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements)

## Browser Compatibility

Tested in Chrome 75

| IE  | Edge | FireFox | Chrome | Safari | Opera |
| --- | ---- | ------- | ------ | ------ | ----- |
| X   | 76~  | 63~     | 54~    | 10.1~  | 41~   |

See [more](https://caniuse.com/#feat=custom-elementsv1)

## ChangeLog

See [CHANGELOG](./CHANGELOG.md)

## Demo

![Demo Screenshot](./screenshot.png)

See [Demo](http://project-kahm.github.io/kecap/)

## Features

- HTML5 Expandable Custom Elements
- Keyboard-driven movable list
- Element prepared listener for lazy loading

## Installation

- Install with npm:

```bash
npm install kecap --save
```

- Clone the repo:

```bash
git clone https://github.com/project-kahm/kecap.git
```

## Usage

### API

`<kecap-a>` is implemented for [Type A](https://github.com/project-kahm/kecap/issues/1), and `<kecap-b>` is implemented for [Type B](https://github.com/project-kahm/kecap/issues/2).

#### Attributes

- `margin` - the size of the gap between an element's rows and columns
- `preload` - number of elements to be preloaded(must be at least 1)
- `itemrow` - the grid row size
- `itemcol` - the grid column size
- `viewportrow` - the viewport row size
- `viewportcol` - the viewport column size

### Example

Set item size and `will-change` attribute.

```css
.item {
    width: 100px;
    height: 100px;
    will-change: transform;
}
```

#### Type A

```html
<kecap-a itemrow="1" itemcol="10" viewportrow="1" viewportcol="5">
    <div class="item">1</div>
    <div class="item">2</div>
    <div class="item">3</div>
    ...
    <div class="item">8</div>
    <div class="item">9</div>
    <div class="item">10</div>
</kecap-a>
```

#### Type B

```html
<kecap-b itemrow="5" itemcol="5" viewportrow="3" viewportcol="3">
    <div class="item">1</div>
    <div class="item">2</div>
    <div class="item">3</div>
    ...
    <div class="item">23</div>
    <div class="item">24</div>
    <div class="item">25</div>
</kecap-b>
```

## Build Setup

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:1234
$ npm run dev

# build for production
$ npm run build

# generate example
$ npm run generate
```

## License

```text
Copyright (c) 2019 Project Kahm

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

Kecap is licensed under the [MIT License](./LICENSE).
