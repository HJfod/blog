
import { build } from "./build.js";
import { watchTree } from "watch";

watchTree('..', {
    interval: 300,
    filter: file => file.includes('posts') || file.includes('site'),
}, _ => {
    build();
});
