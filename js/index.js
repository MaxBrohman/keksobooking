import "@babel/polyfill";
import Map from './map';

new Map();
document.querySelectorAll('fieldset').forEach(fs => fs.disabled = false);