import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Movie } from '../../models/movie';
import { TmdbService } from '../../services/tmdb.service';
import { TrackService } from '../../services/track.service';
import { Product } from 'src/app/models/product';
@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.page.html',
  styleUrls: ['./movie-detail.page.scss'],
})
export class MovieDetailPage implements OnInit {
  movie: Movie;
  boleto_comprado = false;
  mostrar_compra = false;
  constructor(
      private activatedRoute: ActivatedRoute,
      private router: Router,
      private tmdb: TmdbService,
      private track: TrackService
  ) { }

  ngOnInit() {
    const movieId = this.activatedRoute.snapshot.params['id'];
    this.getMovieDetail(movieId);
    let segmento = localStorage.getItem('segmento');
    if(segmento == 'upcoming'){
      this.mostrar_compra = false;
    }else if(segmento == 'popular'){
      this.mostrar_compra = true;
    }
    this.boleto_comprado = false;
  }
  getMovieDetail(id: number) {
    this.tmdb.getMovieDetail(id).subscribe(res => {
      this.movie = res;
      this.track.viewMovie(id, this.movie.title);
    });
  }

  onPersonDetail(id: number) {
    this.router.navigate(['person-detail', id]);
  }

  comprarBoletos(pelicula: Movie){
    this.boleto_comprado = true;
    let cache_arr = localStorage.getItem('carrito_arr');
    let cart_arr: Product[] = JSON.parse(cache_arr);
    let aux = {
      name: pelicula.title,
      price: 70,
      quantity: 1
    }
    let repetido = false;
    cart_arr.forEach( elemento => {
      if(elemento.name == pelicula.title){
        elemento.quantity += 1;
        repetido = true;
      }
    });
    if(!repetido){
      cart_arr.push(aux);
    }
    localStorage.setItem('carrito_arr', JSON.stringify(cart_arr) );
    setTimeout(() => {
      this.boleto_comprado = false;
    }, 5000);
  } 


}
