

import { test } from 'node:test';
import fs from 'fs'
import * as lib from './index.js'

test("create spice flow", async (t) => {

  let spice 
  
  await t.test("parse yaml file", () => {
    spice = fs.readFileSync('./examples/spice.yaml').toString()
    spice = lib.parse(spice)
  });
 
  await t.test("draw diagram", async () => {
    const out = await lib.draw(spice)
    fs.writeFileSync('out.svg', out);
  });

});