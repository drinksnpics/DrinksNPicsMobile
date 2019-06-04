import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TmdbService } from '../../services/tmdb.service';
import { Movie } from '../../models/movie';
import { LoadingController, IonContent } from '@ionic/angular';
import { ViewChild } from '@angular/core';
import { Food } from 'src/app/models/food';
import { User } from 'src/app/models/user';
import { Product } from 'src/app/models/product';
import { AngularFireDatabase, AngularFireList   } from 'angularfire2/database';
import { defineBase } from '@angular/core/src/render3';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  segment: string;
  page: number;
  movies: Movie[];
  food: Food[];
  profile: User;
  profile_active = false;
  carrito = false;
  cart: Product[] = [];
  alimento_comprado = false;
  compra_hecha = false;
  @ViewChild(IonContent) content: IonContent;

  constructor(private router: Router, private loadingCtrl: LoadingController, private tmdb: TmdbService, private db: AngularFireDatabase) {}

  ngOnInit() {
    this.onTabSelected('popular');
    this.alimento_comprado = false;
    let carrito: Product[] = [];
    localStorage.setItem('carrito_arr', JSON.stringify(carrito) );
  }

  onTabSelected(segmentValue: string) {
    this.segment = segmentValue;
    localStorage.setItem('segmento', this.segment );
    this.page = 1;
    this.movies = null;
    this.food = null;
    this.profile = null;
    this.profile_active = false;
    this.carrito = false;
    this.content.scrollToTop();
    if(this.segment == "food"){
      this.db.list<Food>('/FoodProducts').valueChanges().subscribe((values) => {
        this.food = values;
      });
    }else if(this.segment == "profile"){
      this.profile_active = true;
      this.profile = new User();
      this.profile.name = "John Doe";
      this.profile.email = "john_doe@gmail.com";
      this.profile.birthday = "12 de Mayo de 1990";
      this.profile.registro = "21 de Abril de 2019";
    }else if(this.segment == "cart"){
      this.carrito = true;
      let cache_arr = localStorage.getItem('carrito_arr');
      this.cart = JSON.parse(cache_arr);
    }else{
      this.loadMovies();
    }
    
  }

  onNextPage() {
    this.page++;
    this.loadMovies();
  }

  onMovieDetail(id: number) {
    this.router.navigate(['movie-detail', id]);
  }

  private async loadMovies() {
    let service;
    switch (this.segment) {
      case 'popular':  service = this.tmdb.getPopularMovies(this.page); break;
      case 'upcoming': service = this.tmdb.getUpcomingMovies(this.page); break;
    }
    const loadingElement = await this.loadingCtrl.create({
      message: 'Please wait...',
      spinner: 'crescent',
      duration: 2000
    });

    const loading = await this.loadingCtrl.create(loadingElement);

    loading.present();
    service.subscribe(res => {
      if (!this.movies) { this.movies = []; }
      this.movies = this.movies.concat(res);
      loading.dismiss();
    }, err => {
      this.movies = [];
      loading.dismiss();
    });
  }

  agregarComida(comida: Food){
    this.alimento_comprado =  true;
    let cache_arr = localStorage.getItem('carrito_arr');
    let cart_arr: Product[] = JSON.parse(cache_arr);
    let aux = {
      name: comida.productName,
      price: comida.price,
      quantity: 1
    }
    let repetido = false;
    cart_arr.forEach( elemento => {
      if(elemento.name == comida.productName){
        elemento.quantity += 1;
        repetido = true;
      }
    });
    if(!repetido){
      cart_arr.push(aux);
    }
    localStorage.setItem('carrito_arr', JSON.stringify(cart_arr) );
    setTimeout(() => {
      this.alimento_comprado = false;
    }, 5000);
  }

  getSizeCart(){
    let cache_arr = localStorage.getItem('carrito_arr');
    let cart_arr: Product[] = JSON.parse(cache_arr);
    let total = 0;
    cart_arr.forEach( element => {
      total += element.quantity;
    });
    return total;
  }

  getTotalCart(){
    let cache_arr = localStorage.getItem('carrito_arr');
    let cart_arr: Product[] = JSON.parse(cache_arr);
    let total = 0;
    cart_arr.forEach( element => {
      total += ( element.price * element.quantity );
    });
    return total;
  }

  cambiarCantidad(cantidad: any,nombre:string){
    let nueva_cantidad = cantidad.srcElement.value;
    let cache_arr = localStorage.getItem('carrito_arr');
    let cart_arr: Product[] = JSON.parse(cache_arr);
    cart_arr.forEach( element => {
      if(element.name == nombre){
        element.quantity = nueva_cantidad;
      }
    });
    localStorage.setItem('carrito_arr', JSON.stringify(cart_arr) );
  }

  onlyNumbers(e: any){
    let input;
    if (e.metaKey || e.ctrlKey) {
      return true;
    }
    if (e.which === 32) {
      return false;
    }
    if (e.which === 0) {
      return true;
    }
    if (e.which < 33) {
      return true;
    }
    input = String.fromCharCode(e.which);
    return !!/[\d\s]/.test(input);
  }

  guardarCompra(){
    this.compra_hecha = true;
    let cache_arr = localStorage.getItem('carrito_arr');
    let cart_arr: Product[] = JSON.parse(cache_arr);
    let ref = this.db.database.ref('Orders');
    cart_arr.forEach( producto => {
      ref.push({
        Cantidad: producto.quantity,
        Precio: producto.price,
        Producto: producto.name
      });
    });
    let carrito: Product[] = [];
    localStorage.setItem('carrito_arr', JSON.stringify(carrito) );
    setTimeout(() => {
      this.compra_hecha = false;
    }, 5000);
  }

}
