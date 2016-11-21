import express from 'express';
import cors from 'cors';
import onecolor from 'onecolor';


const app = express();
app.use(cors());

app.get('/', (req, res) => {
  if (!req.query.color) {
    return res.send('Invalid color');
  }
  let color = req.query.color.toLowerCase();
  color = color.trim();


  let re = new RegExp('(rgb)([( ]*)([0-9]*)([, ]*)?([0-9]*)([, ]*)?([0-9]*)([ ]*)?([)])');
  let match = color.match(re);
  if (match) {
    const data = color.substr(0, 3);
    if (data !== 'rgb') { return res.send('Invalid color'); }

    if (match[1] == 'rgb' && match[3] && match[5] && match[7]) {
      console.log(match);
      let red = parseInt(match[3], 10);
      if (red > 255) { return res.send('Invalid color'); }
      red = red.toString(16);
      if (red.length === 1) { red = `0${red}`; }

      let green = parseInt(match[5], 10);
      if (green > 255) { return res.send('Invalid color'); }
      green = green.toString(16);
      if (green.length === 1) { green = `0${green}`; }

      let blue = parseInt(match[7], 10);
      if (blue > 255) { return res.send('Invalid color'); }
      blue = blue.toString(16);
      if (blue.length === 1) { blue = `0${blue}`; }

      const cl = `#${red}${green}${blue.toString(16)}`;
      return res.send(cl);
    }
  }

  re = new RegExp('(hsl)([( ]*)([0-9]*)([, ]*)?(%20)?([0-9]*%)([, ]*)?(%20)?([0-9]*%)([ ]*)?([)])');
  match = color.match(re);

  if (match) {
    console.log('HSL:');
    console.log(match);
    let s = match[6].substr(0, match[6].length - 1);
    s = parseInt(s, 10);
    if (s > 100) { return res.send('Invalid color'); }

    let l = match[9].substr(0, match[9].length - 1);
    l = parseInt(l, 10);
    if (l > 100) { return res.send('Invalid color'); }

    const h = parseInt(match[3], 10);
    if (h > 360) { return res.send('Invalid color'); }

    // console.log(hslToRgb(match[3], match[5], match[7]));
    const cl = onecolor(`hsl(${match[3]}, ${match[6]}, ${match[9]})`).hex();
    return res.send(cl);
  }

  if (color[0] === '#') {
    color = color.substr(1);
  }
  console.log(req.query.color);
  re = new RegExp('[^0-9a-f]');
  match = color.search(re);
  if (match !== -1 || color.length > 6 || color.length < 3) {
    return res.send('Invalid color');
  }
  console.log(match);
  if (color.length === 3) {
    const reg = new RegExp('([0-9a-f])?([0-9a-f])?([0-9a-f])?');
    const matches = color.match(reg);
    const red = matches[1];
    const green = matches[2];
    const blue = matches[3];
    const cl = `#${red}${red}${green}${green}${blue}${blue}`;
    return res.send(cl);
  }
  const reg = new RegExp('([0-9a-f][0-9a-f])?([0-9a-f][0-9a-f])?([0-9a-f][0-9a-f])?');
  const matches = color.match(reg);
  const red = matches[1];
  const green = matches[2];
  const blue = matches[3];
  if (!red) {
    return res.send('Invalid color');
  }
  if (!blue) {
    return res.send('Invalid color');
  }
  if (!green) {
    return res.send('Invalid color');
  }
  const cl = `#${red}${green}${blue}`;
  return res.send(cl);
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});
