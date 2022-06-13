var pixelArt = {
    colorPicker: document.getElementById('colorPicker'),
    canvas: document.getElementById('pixelCanvas'),
    selectedColor: colorPicker.value,
    draw: false,
    defaultColor: '',
    darkModeSwitch: document.querySelector('.theme-switch input[type="checkbox"]'),
    ipHeight: document.getElementById('inputHeight'),
    ipWidth: document.getElementById('inputWidth'),


    // Method to convert rgb color to HEX color
    rgbToHex: function (r, g, b) {
        return "#" + pixelArt.componentToHex(r) + pixelArt.componentToHex(g) + pixelArt.componentToHex(b);
    },
    // Method to convert each component 'r,g,b' of color into HEX equivalent. for HEX conversion
    componentToHex: function (c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    },
    // Set max value of width and height input boxes dynamically. Based on the browser window size,at the time of window load.
    setMaxValue: function () {
        pixelArt.ipHeight.setAttribute('max', Math.floor((window.innerHeight - pixelArt.canvas.offsetTop - 20) / 20));
        pixelArt.ipWidth.setAttribute('max', Math.floor((window.innerWidth - 20) / 20));
    },
    // Generate Grid dynamically based on input height and width.
    makeGrid: function (e) {
        pixelArt.canvas.innerHTML = "";
        pixelArt.canvas.style.opacity = 1;
        pixelArt.setBorderColor();
        const height = parseInt(pixelArt.ipHeight.value);
        const width = parseInt(pixelArt.ipWidth.value);
        for (let i = 1; i <= height; i++) {
            const tr = document.createElement('tr');
            for (let j = 1; j <= width; j++) {
                const td = document.createElement('td');
                tr.appendChild(td);
            }
            pixelArt.canvas.appendChild(tr);
        }
        e.preventDefault();
    },
    // Fill current GRID <td> item with selected color.
    // It will also reset the color to default, if user moved mouse over previously painted cell with same selected color.
    fill: function (element) {
        pixelArt.selectedColor = pixelArt.colorPicker.value;
        rgb = element.style.backgroundColor;
        currentColor = rgb.substring(4, rgb.length - 1).replace(/ /g, '').split(',');
        currentColor = pixelArt.rgbToHex(parseInt(currentColor[0]), parseInt(currentColor[1]), parseInt(currentColor[2]));
        if (currentColor === pixelArt.selectedColor) {
            element.style.backgroundColor = pixelArt.defaultColor;
        }
        else {
            element.style.backgroundColor = pixelArt.selectedColor;
        }
    },
    // Set border color for pixel table dynamically on grid create / Reset.
    setBorderColor: function () {
        var root = document.querySelector(':root');
        var r = Math.floor(Math.random() * 256);
        var b = Math.floor(Math.random() * 256);
        var g = Math.floor(Math.random() * 256);
        root.style.setProperty('--pixel-border', `rgb(${r},${g},${b})`);
    },
    // Toggle Dark/light mode
    toggleDarkMode: function () {
        var root = document.querySelector(':root');
        if (!pixelArt.darkModeSwitch.checked) {
            //Disable dark Mode
            root.style.setProperty('--text-color', 'black');
            root.style.setProperty('--bg-color', 'white');
            pixelArt.defaultColor = '#ffffff';
        }
        else {
            root.style.setProperty('--text-color', 'aqua');
            root.style.setProperty('--bg-color', 'black');
            pixelArt.defaultColor = '#000000';
        }
        pixelArt.canvas.querySelectorAll('td').forEach(td => {
            if (td.style.backgroundColor === 'rgb(0,0,0)') {
                td.style.backgroundColor = '#ffffff';
            } else if (td.style.backgroundColor === 'rgb(255,255,255)') {
                td.style.backgroundColor = '#ffffff';
            }
        });
    },
    // Bind all canvas related event / set defaults for elements.
    bindCanvasEvents: function () {
        pixelArt.setMaxValue();
        pixelArt.defaultColor = '#ffffff';
        const form = document.getElementById('sizePicker');
        form.addEventListener('submit', pixelArt.makeGrid);
        pixelArt.canvas.addEventListener('mousedown', function (event) {
            pixelArt.fill(event.target);
        });
        pixelArt.canvas.addEventListener('mouseover', function (event) {
            if (!draw) { // return if drawing is not enabled I.E mouse button is not clicked or clicked outside drawing canvas.
                return;
            }
            pixelArt.fill(event.target);
        });
        document.addEventListener('mousedown', function () {
            draw = true;
        });
        document.addEventListener('mouseup', function () {
            draw = false;
        });
        ['pointermove', 'pointercancel'].forEach(evt => document.addEventListener(evt, function (e) {
            e.preventDefault();
        }));
        pixelArt.darkModeSwitch.addEventListener('change', function (e) {
            e.preventDefault();
            pixelArt.toggleDarkMode();
        }, false);
    }
} // End of PixelArt object

// Initiate pixel canvas events on DOM contents loaded.
window.addEventListener('DOMContentLoaded', function () {
    pixelArt.bindCanvasEvents();
});