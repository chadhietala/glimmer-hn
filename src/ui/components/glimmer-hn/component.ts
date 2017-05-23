import { Component, tracked } from "@glimmer/component";
let links = document.getElementById('links');

Array.from(links.querySelectorAll('.item')).forEach((item) => {
  links.removeChild(item);
});


export default class GlimmerHn extends Component {
  nav = document.getElementById('links')

  @tracked
  results = [];
  item = 0
  constructor(injections) {
    super(injections);
    window['fetch']('/api/top').then((result) => {
      this.results = result;
    });
  }
}
