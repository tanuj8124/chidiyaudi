// Master list of items for the game
export interface GameItem {
  id: string;
  name: string;
  imageUrl: string;
  canFly: boolean;
}

export const GAME_ITEMS: GameItem[] = [
  // Flying items
  { id: '1', name: 'Eagle', imageUrl: '/images/eagle.jpg', canFly: true },
  { id: '2', name: 'Parrot', imageUrl: '/images/parrot.jpg', canFly: true },
  { id: '3', name: 'Butterfly', imageUrl: '/images/butterfly.jpg', canFly: true },
  { id: '4', name: 'Airplane', imageUrl: '/images/airplane.jpg', canFly: true },
  { id: '5', name: 'Helicopter', imageUrl: '/images/helicopter.jpg', canFly: true },
  { id: '6', name: 'Drone', imageUrl: '/images/drone.jpg', canFly: true },
  { id: '7', name: 'Kite', imageUrl: '/images/kite.jpg', canFly: true },
  { id: '8', name: 'Dove', imageUrl: '/images/dove.jpg', canFly: true },
  { id: '9', name: 'Bee', imageUrl: '/images/bee.jpg', canFly: true },
  { id: '10', name: 'Crow', imageUrl: '/images/crow.jpg', canFly: true },
  { id: '11', name: 'Sparrow', imageUrl: '/images/sparrow.jpg', canFly: true },
  { id: '12', name: 'Pigeon', imageUrl: '/images/pigeon.jpg', canFly: true },
  { id: '13', name: 'Owl', imageUrl: '/images/owl.jpg', canFly: true },
  { id: '14', name: 'Falcon', imageUrl: '/images/falcon.jpg', canFly: true },
  { id: '15', name: 'Bat', imageUrl: '/images/bat.jpg', canFly: true },
  { id: '16', name: 'Dragonfly', imageUrl: '/images/dragonfly.jpg', canFly: true },
  { id: '17', name: 'Jet', imageUrl: '/images/jet.jpg', canFly: true },
  { id: '18', name: 'Glider', imageUrl: '/images/glider.jpg', canFly: true },
  { id: '19', name: 'Hot Air Balloon', imageUrl: '/images/hot-air-balloon.jpg', canFly: true },
  { id: '20', name: 'Rocket', imageUrl: '/images/rocket.jpg', canFly: true },
  { id: '21', name: 'UFO', imageUrl: '/images/ufo.jpg', canFly: true },
  { id: '22', name: 'Hang Glider', imageUrl: '/images/hang-glider.jpg', canFly: true },
  { id: '23', name: 'Paraglider', imageUrl: '/images/paraglider.jpg', canFly: true },
  { id: '24', name: 'Seagull', imageUrl: '/images/seagull.jpg', canFly: true },
  { id: '25', name: 'Pelican', imageUrl: '/images/pelican.jpg', canFly: true },
  { id: '26', name: 'Swan', imageUrl: '/images/swan.jpg', canFly: true },
  { id: '27', name: 'Duck', imageUrl: '/images/duck.jpg', canFly: true },
  { id: '28', name: 'Goose', imageUrl: '/images/goose.jpg', canFly: true },
  { id: '29', name: 'Flamingo', imageUrl: '/images/flamingo.jpg', canFly: true },
  { id: '30', name: 'Hawk', imageUrl: '/images/hawk.jpg', canFly: true },
  { id: '31', name: 'Vulture', imageUrl: '/images/vulture.jpg', canFly: true },
  { id: '32', name: 'Crane Bird', imageUrl: '/images/crane-bird.jpg', canFly: true },
  { id: '33', name: 'Stork', imageUrl: '/images/stork.jpg', canFly: true },
  { id: '34', name: 'Moth', imageUrl: '/images/moth.jpg', canFly: true },
  { id: '35', name: 'Ladybug', imageUrl: '/images/ladybug.jpg', canFly: true },
  { id: '36', name: 'Wasp', imageUrl: '/images/wasp.jpg', canFly: true },
  { id: '37', name: 'Mosquito', imageUrl: '/images/mosquito.jpg', canFly: true },
  { id: '38', name: 'Firefly', imageUrl: '/images/firefly.jpg', canFly: true },
  { id: '39', name: 'Paper Plane', imageUrl: '/images/paper-plane.jpg', canFly: true },
  { id: '40', name: 'Flying Car', imageUrl: '/images/flying-car.jpg', canFly: true },
  { id: '41', name: 'Jetpack', imageUrl: '/images/jetpack.jpg', canFly: true },
  { id: '42', name: 'Spaceship', imageUrl: '/images/spaceship.jpg', canFly: true },
  { id: '43', name: 'Magic Carpet', imageUrl: '/images/magic-carpet.jpg', canFly: true },
  { id: '44', name: 'Blimp', imageUrl: '/images/blimp.jpg', canFly: true },
  { id: '45', name: 'Zeppelin', imageUrl: '/images/zeppelin.jpg', canFly: true },
  { id: '46', name: 'Flying Saucer', imageUrl: '/images/flying-saucer.jpg', canFly: true },
  { id: '47', name: 'Autogyro', imageUrl: '/images/autogyro.jpg', canFly: true },
  { id: '48', name: 'Model Airplane', imageUrl: '/images/model-airplane.jpg', canFly: true },
  { id: '49', name: 'RC Helicopter', imageUrl: '/images/rc-helicopter.jpg', canFly: true },
  { id: '50', name: 'Flying Squirrel', imageUrl: '/images/flying-squirrel.jpg', canFly: true },
  { id: '51', name: 'Phoenix', imageUrl: '/images/phoenix.jpg', canFly: true },
  { id: '52', name: 'Dragon', imageUrl: '/images/dragon.jpg', canFly: true },

  // Non-flying items
  { id: '53', name: 'Dog', imageUrl: '/images/dog.jpg', canFly: false },
  { id: '54', name: 'Cat', imageUrl: '/images/cat.jpg', canFly: false },
  { id: '55', name: 'Tree', imageUrl: '/images/tree.jpg', canFly: false },
  { id: '56', name: 'Car', imageUrl: '/images/car.jpg', canFly: false },
  { id: '57', name: 'House', imageUrl: '/images/house.jpg', canFly: false },
  { id: '58', name: 'Fish', imageUrl: '/images/fish.jpg', canFly: false },
  { id: '59', name: 'Lion', imageUrl: '/images/lion.jpg', canFly: false },
  { id: '60', name: 'Elephant', imageUrl: '/images/elephant.jpg', canFly: false },
  { id: '61', name: 'Flower', imageUrl: '/images/flower.jpg', canFly: false },
  { id: '62', name: 'Ball', imageUrl: '/images/ball.jpg', canFly: false },
  { id: '63', name: 'Horse', imageUrl: '/images/horse.jpg', canFly: false },
  { id: '64', name: 'Cow', imageUrl: '/images/cow.jpg', canFly: false },
  { id: '65', name: 'Tiger', imageUrl: '/images/tiger.jpg', canFly: false },
  { id: '66', name: 'Bear', imageUrl: '/images/bear.jpg', canFly: false },
  { id: '67', name: 'Rabbit', imageUrl: '/images/rabbit.jpg', canFly: false },
  { id: '68', name: 'Deer', imageUrl: '/images/deer.jpg', canFly: false },
  { id: '69', name: 'Bus', imageUrl: '/images/bus.jpg', canFly: false },
  { id: '70', name: 'Truck', imageUrl: '/images/truck.jpg', canFly: false },
  { id: '71', name: 'Bicycle', imageUrl: '/images/bicycle.jpg', canFly: false },
  { id: '72', name: 'Motorcycle', imageUrl: '/images/motorcycle.jpg', canFly: false },
  { id: '73', name: 'Train', imageUrl: '/images/train.jpg', canFly: false },
  { id: '74', name: 'Tractor', imageUrl: '/images/tractor.jpg', canFly: false },
  { id: '75', name: 'Scooter', imageUrl: '/images/scooter.jpg', canFly: false },
  { id: '76', name: 'Wheelchair', imageUrl: '/images/wheelchair.jpg', canFly: false },
  { id: '77', name: 'Skateboard', imageUrl: '/images/skateboard.jpg', canFly: false },
  { id: '78', name: 'Table', imageUrl: '/images/table.jpg', canFly: false },
  { id: '79', name: 'Chair', imageUrl: '/images/chair.jpg', canFly: false },
  { id: '80', name: 'Sofa', imageUrl: '/images/sofa.jpg', canFly: false },
  { id: '81', name: 'Bed', imageUrl: '/images/bed.jpg', canFly: false },
  { id: '82', name: 'Cupboard', imageUrl: '/images/cupboard.jpg', canFly: false },
  { id: '83', name: 'Desk', imageUrl: '/images/desk.jpg', canFly: false },
  { id: '84', name: 'Bookshelf', imageUrl: '/images/bookshelf.jpg', canFly: false },
  { id: '85', name: 'Lamp', imageUrl: '/images/lamp.jpg', canFly: false },
  { id: '86', name: 'Television', imageUrl: '/images/television.jpg', canFly: false },
  { id: '87', name: 'Refrigerator', imageUrl: '/images/refrigerator.jpg', canFly: false },
  { id: '88', name: 'Rock', imageUrl: '/images/rock.jpg', canFly: false },
  { id: '89', name: 'Mountain', imageUrl: '/images/mountain.jpg', canFly: false },
  { id: '90', name: 'River', imageUrl: '/images/river.jpg', canFly: false },
  { id: '91', name: 'Building', imageUrl: '/images/building.jpg', canFly: false },
  { id: '92', name: 'Road', imageUrl: '/images/road.jpg', canFly: false },
  { id: '93', name: 'Bridge', imageUrl: '/images/bridge.jpg', canFly: false },
  { id: '94', name: 'Bench', imageUrl: '/images/bench.jpg', canFly: false },
  { id: '95', name: 'Statue', imageUrl: '/images/statue.jpg', canFly: false },
  { id: '96', name: 'Phone', imageUrl: '/images/phone.jpg', canFly: false },
  { id: '97', name: 'Laptop', imageUrl: '/images/laptop.jpg', canFly: false },
  { id: '98', name: 'Keyboard', imageUrl: '/images/keyboard.jpg', canFly: false },
  { id: '99', name: 'Mouse', imageUrl: '/images/mouse.jpg', canFly: false },
  { id: '100', name: 'Camera', imageUrl: '/images/camera.jpg', canFly: false },
  { id: '101', name: 'Watch', imageUrl: '/images/watch.jpg', canFly: false },
  { id: '102', name: 'Bottle', imageUrl: '/images/bottle.jpg', canFly: false },
  { id: '103', name: 'Bag', imageUrl: '/images/bag.jpg', canFly: false },
  { id: '104', name: 'Shoes', imageUrl: '/images/shoes.jpg', canFly: false },
  { id: '105', name: 'Book', imageUrl: '/images/book.jpg', canFly: false }
];

export function getRandomItem(): GameItem {
  return GAME_ITEMS[Math.floor(Math.random() * GAME_ITEMS.length)];
}

export function validateAnswer(itemId: string, answer: string): boolean {
  const item = GAME_ITEMS.find((i) => i.id === itemId);
  if (!item) return false;

  if (answer === 'up') return item.canFly;
  if (answer === 'down') return !item.canFly;
  return false;
}
