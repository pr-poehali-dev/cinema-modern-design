import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';

interface Movie {
  id: number;
  title: string;
  genre: string;
  duration: string;
  rating: string;
  image: string;
  description: string;
  showTimes: string[];
}

interface Seat {
  id: string;
  row: number;
  number: number;
  isOccupied: boolean;
  isSelected: boolean;
}

const movies: Movie[] = [
  {
    id: 1,
    title: 'Эпическая Битва',
    genre: 'Боевик',
    duration: '142 мин',
    rating: '16+',
    image: 'https://cdn.poehali.dev/projects/49d13cdd-a83a-44e3-bc06-4cea4e8177aa/files/b50e0904-7bd4-447e-80c5-75347e8a2f47.jpg',
    description: 'Захватывающий боевик о героях, спасающих город от неминуемой катастрофы.',
    showTimes: ['10:00', '13:30', '17:00', '20:30']
  },
  {
    id: 2,
    title: 'Любовь в Париже',
    genre: 'Романтическая комедия',
    duration: '98 мин',
    rating: '12+',
    image: 'https://cdn.poehali.dev/projects/49d13cdd-a83a-44e3-bc06-4cea4e8177aa/files/3a580b42-1d6b-4b28-93a8-23acf1b48f8f.jpg',
    description: 'Романтическая история о двух незнакомцах, встретившихся в сердце Парижа.',
    showTimes: ['11:00', '14:00', '18:30', '21:00']
  },
  {
    id: 3,
    title: 'Космическая Одиссея',
    genre: 'Научная фантастика',
    duration: '156 мин',
    rating: '12+',
    image: 'https://cdn.poehali.dev/projects/49d13cdd-a83a-44e3-bc06-4cea4e8177aa/files/f06914c6-f0aa-4b52-b88d-3785d761b786.jpg',
    description: 'Эпическое путешествие через галактику в поисках нового дома для человечества.',
    showTimes: ['12:00', '15:30', '19:00', '22:00']
  }
];

const promotions = [
  {
    id: 1,
    title: 'Студенческие среды',
    description: 'Скидка 50% на все сеансы по средам при предъявлении студенческого билета',
    icon: 'GraduationCap',
    discount: '-50%'
  },
  {
    id: 2,
    title: 'Семейные выходные',
    description: 'При покупке 4 билетов - попкорн в подарок!',
    icon: 'Users',
    discount: 'Подарок'
  },
  {
    id: 3,
    title: 'Утренние сеансы',
    description: 'Билеты до 12:00 со скидкой 30%',
    icon: 'Coffee',
    discount: '-30%'
  }
];

const generateSeats = (): Seat[] => {
  const seats: Seat[] = [];
  const occupiedSeats = [12, 13, 25, 26, 27, 38, 39, 45, 52, 53, 54];
  
  for (let row = 1; row <= 8; row++) {
    for (let num = 1; num <= 10; num++) {
      const seatId = `${row}-${num}`;
      const seatIndex = (row - 1) * 10 + num;
      seats.push({
        id: seatId,
        row,
        number: num,
        isOccupied: occupiedSeats.includes(seatIndex),
        isSelected: false
      });
    }
  }
  return seats;
};

const Index = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [seats, setSeats] = useState<Seat[]>(generateSeats());
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const handleSeatClick = (seatId: string) => {
    setSeats(prevSeats => 
      prevSeats.map(seat => 
        seat.id === seatId && !seat.isOccupied
          ? { ...seat, isSelected: !seat.isSelected }
          : seat
      )
    );
  };

  const selectedSeatsCount = seats.filter(s => s.isSelected).length;
  const totalPrice = selectedSeatsCount * 450;

  const openBooking = (movie: Movie) => {
    setSelectedMovie(movie);
    setSelectedTime(null);
    setSeats(generateSeats());
    setIsBookingOpen(true);
  };

  const scrollToSection = (section: string) => {
    setActiveSection(section);
    document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon name="Film" size={32} className="text-primary" />
              <h1 className="text-2xl font-bold">КиноМакс</h1>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <button onClick={() => scrollToSection('home')} className={`hover:text-primary transition-colors ${activeSection === 'home' ? 'text-primary' : ''}`}>
                Афиша
              </button>
              <button onClick={() => scrollToSection('promotions')} className={`hover:text-primary transition-colors ${activeSection === 'promotions' ? 'text-primary' : ''}`}>
                Акции
              </button>
              <button onClick={() => scrollToSection('about')} className={`hover:text-primary transition-colors ${activeSection === 'about' ? 'text-primary' : ''}`}>
                О нас
              </button>
              <button onClick={() => scrollToSection('contacts')} className={`hover:text-primary transition-colors ${activeSection === 'contacts' ? 'text-primary' : ''}`}>
                Контакты
              </button>
            </nav>
            <Button className="hidden md:inline-flex">
              <Icon name="Ticket" size={20} className="mr-2" />
              Мои билеты
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section id="home" className="py-16 px-4">
          <div className="container mx-auto">
            <div className="mb-12 text-center animate-fade-in">
              <h2 className="text-5xl font-bold mb-4">Сейчас в кино</h2>
              <p className="text-muted-foreground text-lg">Выберите фильм и забронируйте лучшие места</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {movies.map((movie, index) => (
                <Card key={movie.id} className="overflow-hidden hover-scale animate-fade-in bg-card border-border" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="relative aspect-[2/3] overflow-hidden">
                    <img src={movie.image} alt={movie.title} className="w-full h-full object-cover" />
                    <Badge className="absolute top-4 right-4 bg-secondary text-secondary-foreground">{movie.rating}</Badge>
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-2">{movie.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <Icon name="Tag" size={16} />
                        {movie.genre}
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon name="Clock" size={16} />
                        {movie.duration}
                      </span>
                    </div>
                    <p className="text-muted-foreground mb-6">{movie.description}</p>
                    <Button onClick={() => openBooking(movie)} className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                      <Icon name="Ticket" size={20} className="mr-2" />
                      Купить билет
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="promotions" className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto">
            <div className="mb-12 text-center">
              <h2 className="text-4xl font-bold mb-4">Акции и скидки</h2>
              <p className="text-muted-foreground text-lg">Выгодные предложения для наших гостей</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {promotions.map((promo) => (
                <Card key={promo.id} className="p-6 hover-scale bg-card border-border">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-full bg-primary/10">
                      <Icon name={promo.icon as any} size={32} className="text-primary" />
                    </div>
                    <Badge variant="secondary" className="text-lg px-3 py-1">{promo.discount}</Badge>
                  </div>
                  <h3 className="text-xl font-bold mb-3">{promo.title}</h3>
                  <p className="text-muted-foreground">{promo.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">О нас</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="p-6 bg-card border-border">
                <Icon name="Star" size={40} className="text-primary mb-4" />
                <h3 className="text-xl font-bold mb-3">Современные технологии</h3>
                <p className="text-muted-foreground">Новейшее оборудование, технология Dolby Atmos и экраны IMAX для максимального погружения в атмосферу фильма.</p>
              </Card>
              <Card className="p-6 bg-card border-border">
                <Icon name="Armchair" size={40} className="text-primary mb-4" />
                <h3 className="text-xl font-bold mb-3">Комфортные залы</h3>
                <p className="text-muted-foreground">Удобные кресла с регулировкой, просторные залы и идеальная акустика создают незабываемые впечатления.</p>
              </Card>
              <Card className="p-6 bg-card border-border">
                <Icon name="Popcorn" size={40} className="text-primary mb-4" />
                <h3 className="text-xl font-bold mb-3">Вкусный буфет</h3>
                <p className="text-muted-foreground">Свежий попкорн, прохладительные напитки и закуски на любой вкус. Всё для идеального киносеанса.</p>
              </Card>
              <Card className="p-6 bg-card border-border">
                <Icon name="Heart" size={40} className="text-primary mb-4" />
                <h3 className="text-xl font-bold mb-3">Лучший сервис</h3>
                <p className="text-muted-foreground">Наша команда всегда готова помочь и сделать ваш визит в кинотеатр максимально приятным и комфортным.</p>
              </Card>
            </div>
          </div>
        </section>

        <section id="contacts" className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Контакты</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="p-8 bg-card border-border">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <Icon name="MapPin" size={24} className="text-primary mt-1" />
                    <div>
                      <h4 className="font-semibold mb-1">Адрес</h4>
                      <p className="text-muted-foreground">г. Москва, ул. Кинематографическая, д. 25</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Icon name="Phone" size={24} className="text-primary mt-1" />
                    <div>
                      <h4 className="font-semibold mb-1">Телефон</h4>
                      <p className="text-muted-foreground">+7 (495) 123-45-67</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Icon name="Mail" size={24} className="text-primary mt-1" />
                    <div>
                      <h4 className="font-semibold mb-1">Email</h4>
                      <p className="text-muted-foreground">info@kinomax.ru</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Icon name="Clock" size={24} className="text-primary mt-1" />
                    <div>
                      <h4 className="font-semibold mb-1">Часы работы</h4>
                      <p className="text-muted-foreground">Ежедневно с 9:00 до 01:00</p>
                    </div>
                  </div>
                </div>
              </Card>
              <Card className="p-8 bg-card border-border">
                <h3 className="text-xl font-bold mb-6">Как добраться</h3>
                <div className="space-y-4 text-muted-foreground">
                  <div className="flex items-start gap-3">
                    <Icon name="Train" size={20} className="text-primary mt-1" />
                    <p>Метро "Площадь Кино", выход 3, 5 минут пешком</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Icon name="Bus" size={20} className="text-primary mt-1" />
                    <p>Автобусы: 12, 45, 78. Остановка "Кинотеатр КиноМакс"</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Icon name="Car" size={20} className="text-primary mt-1" />
                    <p>Бесплатная парковка для посетителей кинотеатра</p>
                  </div>
                </div>
                <div className="mt-6 flex gap-4">
                  <Button variant="outline" className="flex-1">
                    <Icon name="Navigation" size={20} className="mr-2" />
                    На карте
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-muted/50 border-t border-border py-8 px-4">
        <div className="container mx-auto text-center text-muted-foreground">
          <div className="flex justify-center gap-6 mb-4">
            <button className="hover:text-primary transition-colors">
              <Icon name="Instagram" size={24} />
            </button>
            <button className="hover:text-primary transition-colors">
              <Icon name="Youtube" size={24} />
            </button>
            <button className="hover:text-primary transition-colors">
              <Icon name="Facebook" size={24} />
            </button>
          </div>
          <p>© 2024 КиноМакс. Все права защищены.</p>
        </div>
      </footer>

      <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedMovie?.title}</DialogTitle>
            <DialogDescription>Выберите время и места для просмотра</DialogDescription>
          </DialogHeader>

          {!selectedTime ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Выберите время сеанса</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {selectedMovie?.showTimes.map((time) => (
                    <Button
                      key={time}
                      variant="outline"
                      className="h-16 text-lg"
                      onClick={() => setSelectedTime(time)}
                    >
                      <Icon name="Clock" size={20} className="mr-2" />
                      {time}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={() => setSelectedTime(null)}>
                  <Icon name="ChevronLeft" size={20} className="mr-2" />
                  Изменить время
                </Button>
                <Badge variant="secondary" className="text-lg px-4 py-2">{selectedTime}</Badge>
              </div>

              <div>
                <div className="bg-primary/20 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <Icon name="Monitor" size={24} className="text-primary" />
                    <span className="font-semibold">ЭКРАН</span>
                  </div>
                </div>

                <div className="space-y-2">
                  {Array.from({ length: 8 }, (_, rowIndex) => (
                    <div key={rowIndex} className="flex items-center gap-2">
                      <span className="w-8 text-center text-sm font-semibold text-muted-foreground">
                        {rowIndex + 1}
                      </span>
                      <div className="flex gap-2 flex-1 justify-center">
                        {seats
                          .filter(seat => seat.row === rowIndex + 1)
                          .map(seat => (
                            <button
                              key={seat.id}
                              onClick={() => handleSeatClick(seat.id)}
                              disabled={seat.isOccupied}
                              className={`w-8 h-8 rounded transition-all ${
                                seat.isOccupied
                                  ? 'bg-muted cursor-not-allowed'
                                  : seat.isSelected
                                  ? 'bg-secondary scale-110'
                                  : 'bg-primary/30 hover:bg-primary/50'
                              }`}
                            >
                              <Icon 
                                name="Armchair" 
                                size={16} 
                                className={seat.isSelected ? 'text-secondary-foreground' : ''} 
                              />
                            </button>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-center gap-6 mt-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-primary/30 rounded"></div>
                    <span>Свободно</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-secondary rounded"></div>
                    <span>Выбрано</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-muted rounded"></div>
                    <span>Занято</span>
                  </div>
                </div>
              </div>

              {selectedSeatsCount > 0 && (
                <div className="bg-muted/50 rounded-lg p-6 space-y-4">
                  <div className="flex justify-between text-lg">
                    <span>Выбрано мест:</span>
                    <span className="font-semibold">{selectedSeatsCount}</span>
                  </div>
                  <div className="flex justify-between text-lg">
                    <span>Цена за билет:</span>
                    <span className="font-semibold">450 ₽</span>
                  </div>
                  <div className="border-t border-border pt-4 flex justify-between text-xl font-bold">
                    <span>Итого:</span>
                    <span className="text-secondary">{totalPrice} ₽</span>
                  </div>
                  <Button className="w-full h-14 text-lg bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                    <Icon name="CreditCard" size={24} className="mr-2" />
                    Оплатить {totalPrice} ₽
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
