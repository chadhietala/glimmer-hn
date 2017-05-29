import Component, { tracked } from "@glimmer/component";
import { onChange } from '../../../utils/router';

let links = document.getElementById('links');

let listViews = ['top', 'jobs', 'newest', 'show', 'ask'];

Array.from(links.querySelectorAll('.item')).forEach((item) => {
  links.removeChild(item);
});

export default class GlimmerHn extends Component {
  nav = document.getElementById('links')
  item = 0
  cache = {};
  articleCache = {};
  commentsCache = {};

  @tracked results = [];
  @tracked isListView = true;
  @tracked isComments = false;
  @tracked comments = {};
  @tracked currentArticle = {};

  constructor(injections) {
    super(injections);

    onChange((slug: string, params: any) => {
      if (listViews.indexOf(slug) > -1) {
        this.isListView = true;
        this.isComments = false;
        this.fetchListView(slug, params);
        return;
      }

      if (slug === 'comments') {
        this.isComments = true;
        if (this.articleCache[params.articleId] !== undefined) {
          this.currentArticle = this.articleCache[params.articleId];
        }

        this.fetchComments(params.articleId);
      } else {
        this.isComments = false;
      }


      this.isListView = false;
    });
  }

  fetchComments(id) {
    if (this.articleCache[id] !== undefined) {
      this.currentArticle = this.articleCache[id];
    }

    if (this.commentsCache[id] !== undefined) {
      this.comments = this.commentsCache[id];
    }

    if (this.commentsCache[id] === undefined) {
      window['fetch'](`/item/${id}`).then(result => result.json()).then(data => {
        this.comments = this.commentsCache[id] = data.comments;
        delete data.comments;
        this.currentArticle = this.articleCache[id] = data;
      });
    }
  }

  fetchListView(slug, params) {
    let api = slug;
    if (slug === 'top') {
      api = 'news'
    }

    let endpoint = `/${api}`;

    if (this.cache[endpoint] !== undefined) {
      this.results = this.cache[endpoint];
    } else {
      window['fetch'](endpoint).then((result) => result.json()).then((data) => {
        this.results = this.cache[endpoint] = data;

        data.forEach((article) => {
          this.articleCache[article.id] = article;
        });
      });
    }
  }
}
