import ImagesService from './ImagesService.js';
import LoadMoreBtn from './LoadMoreBtn.js';
import Notiflix, { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  form: document.getElementById('search-form'),
  imagesWrapper: document.getElementById('imagesWrapper'),
};

const imagesService = new ImagesService();
const loadMoreBtn = new LoadMoreBtn({
  selector: '#loadMore',
  isHidden: true,
});

refs.form.addEventListener('submit', onSubmit);
loadMoreBtn.button.addEventListener('click', onLoadMore);

function onSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const value = form.elements.searchQuery.value.trim();

  if (value === '') {
    Notify.failure('No value!');
  } else {
    imagesService.searchQuery = value;
    imagesService.resetPage();

    loadMoreBtn.show();
    clearImagesList();
    fetchImages();
  }
}

async function fetchImages() {
  loadMoreBtn.disable();

  try {
    const markup = await getImagesMarkup();
    if (!markup) throw new Error('No data');
    updateImagesList(markup);
  } catch (err) {
    onError(err);
  }

  if (imagesService.totalHits > 40){
    loadMoreBtn.enable();
  }
  else {
    loadMoreBtn.end();
  }

}
const per_page = 40;

function onLoadMore(event) {
  event.preventDefault();
  const totalImages = imagesService.totalHits;
  const maxPage = Math.ceil(totalImages / per_page) + 1;

  if (maxPage > imagesService.page) {
    loadMoreBtn.show();
    fetchImages();
  } else {
    imagesService.page = 0;

    loadMoreBtn.end();
    Notiflix.Notify.warning(
      "We're sorry, but you've reached the end of search results."
    );
  }
}

async function getImagesMarkup() {
  try {
    const images = await imagesService.getImages();

    if (images.length === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again'
      );
      loadMoreBtn.hide();
      return '';
    } else {
      return images.reduce((markup, image) => markup + createMarkup(image), '');
    }
  } catch (err) {
    onError(err);
  }
}

function createMarkup({
  webformatURL,
  largeImageURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  return `
    <div class="photo-card">
      <a href="${largeImageURL}">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" />
      </a>
      <div class="info">
        <p class="info-item">
          <b>Likes</b><br>${likes}
        </p>
        <p class="info-item">
          <b>Views</b><br>${views}
        </p>
        <p class="info-item">
          <b>Comments</b><br>${comments}
        </p>
        <p class="info-item">
          <b>Downloads</b><br>${downloads}
        </p>
      </div>
    </div>`;
}

function updateImagesList(markup) {
  refs.imagesWrapper.insertAdjacentHTML('beforeend', markup);

  let gallery = new SimpleLightbox('a', {
    showCounter: false,
    captions: true,
    captionsData: 'alt',
    captionClass: 'captions-style',
  }).refresh();
}

function clearImagesList() {
  refs.imagesWrapper.innerHTML = '';
}

function onError(err) {
  loadMoreBtn.hide();
}
