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
  
  // Non-flying items
  { id: '11', name: 'Dog', imageUrl: '/images/dog.jpg', canFly: false },
  { id: '12', name: 'Cat', imageUrl: '/images/cat.jpg', canFly: false },
  { id: '13', name: 'Tree', imageUrl: '/images/tree.jpg', canFly: false },
  { id: '14', name: 'Car', imageUrl: '/images/car.jpg', canFly: false },
  { id: '15', name: 'House', imageUrl: '/images/house.jpg', canFly: false },
  { id: '16', name: 'Fish', imageUrl: '/images/fish.jpg', canFly: false },
  { id: '17', name: 'Lion', imageUrl: '/images/lion.jpg', canFly: false },
  { id: '18', name: 'Elephant', imageUrl: '/images/elephant.jpg', canFly: false },
  { id: '19', name: 'Flower', imageUrl: '/images/flower.jpg', canFly: false },
  { id: '20', name: 'Ball', imageUrl: '/images/ball.jpg', canFly: false },
];

export function getRandomItem(): GameItem {
  return GAME_ITEMS[Math.floor(Math.random() * GAME_ITEMS.length)];
}

export function validateAnswer(itemId: string, answer: string): boolean {
  const item = GAME_ITEMS.find((i) => i.id === itemId);
  if (!item) return false;
  return item.name.toLowerCase() === answer.toLowerCase();
}
