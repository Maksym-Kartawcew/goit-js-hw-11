import axios from 'axios';
import Notiflix from 'notiflix';

const URL = 'https://pixabay.com/api/';
const API_KEY = '36837848-516d951f80548e8f5fb29462d';

export default class ImagesService {
  constructor() {
    this.page = 1;
    this.searchQuery = '';
    this.totalHits = 0;
  }

  async getImages() {
    const parameters = new URLSearchParams({
      page: this.page,
      q: this.searchQuery,
      per_page: 40,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
    });

    const response = await axios.get(`${URL}?key=${API_KEY}&${parameters}`);

    if (this.page === 1) {
      this.totalHits = response.data.totalHits;
      if (this.totalHits !== 0) {
        Notiflix.Notify.success(`Hooray! We found ${this.totalHits} images!`);
      }
    }

    this.incrementPage();
    return response.data.hits;
  }

  resetPage() {
    this.page = 1;
  }

  incrementPage() {
    this.page += 1;
  }
}
