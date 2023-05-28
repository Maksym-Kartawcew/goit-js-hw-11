import axios from 'axios';

const URL = 'https://pixabay.com/api/';
const API_KEY = '36837848-516d951f80548e8f5fb29462d';

export default class ImagesService {
  constructor() {
    this.page = 1;
    this.searchQuery = '';
  }

async getImages() {
  const parameters = new URLSearchParams({
    q: this.searchQuery,
    per_page: 40,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
  });

  const { data } = await axios.get(
    `${URL}?key=${API_KEY}&${parameters}&page=${this.page}`
  );


  this.incrementPage();
  return data.hits; }


  resetPage() {
    this.page = 1;
  }

  incrementPage() {
    this.page += 1;
  }
}




