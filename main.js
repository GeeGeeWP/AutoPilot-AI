const carCanvas=document.getElementById("carCanvas");
carCanvas.width = 200;
// const networkCanvas=document.getElementById("networkCanvas");
// networkCanvas.width = 300;

const carCtx = carCanvas.getContext("2d");
// const networkCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width/2,carCanvas.width*.95);

const N = 100;
const cars = generateCars(N);
let bestCar=cars[0];
if(localStorage.getItem("bestBrain")){
    for(let i=0;i<cars.length;i++){
        cars[i].brain=JSON.parse(
            localStorage.getItem("bestBrain"));
        if(i!=0){
            NeuralNetwork.mutate(cars[i].brain,.2)
        }
    }
}

const obstacles = 30;

// const traffic = [];
//     for(let i=0;i<obstacles;i++){
//         traffic.push(new Car(road.getLaneCenter(Math.floor(Math.random() * (road.laneCount + 1))), -(Math.floor(Math.random()*10000)),30,50,"DUMMY",0))
//     }

const traffic = [];
    for(let i=0;i<obstacles;i++){
        traffic.push(new Car(road.getLaneCenter(Math.floor(Math.random() * (road.laneCount + 1))), -(Math.floor(Math.random()*10000)),30,50,"DUMMY",0))
    }


animate();

function save(){
    localStorage.setItem("bestBrain",
    JSON.stringify(bestCar.brain))
}

function discard(){
    localStorage.removeItem("bestBrain");
}

function generateCars(N){
    const cars=[];
    for(let i=1;i<=N;i++){
        cars.push(new Car(road.getLaneCenter(Math.floor(Math.random() * (road.laneCount + 1))), 100,30,50,"AI"))
    }
    return cars;
}

function animate(time){
    for(let i=0;i<traffic.length;i++){
        traffic[i].update(road.borders,[]);
    }
    for(let i=0;i<cars.length;i++){
        cars[i].update(road.borders,traffic);
    }
    bestCar=cars.find(
        c=>c.y==Math.min(
            ...cars.map(c=>c.y)
        )
    );

    
    carCanvas.height=window.innerHeight;
    // networkCanvas.height=window.innerHeight;

    carCtx.save()
    carCtx.translate(0,-bestCar.y+carCanvas.height*.8);

    road.draw(carCtx);
    for(let i=0;i<traffic.length;i++){
        traffic[i].draw(carCtx, "yellow'");
    }

    for(let i=0;i<cars.length;i++){
        cars[i].draw(carCtx, "blue");
    }
    carCtx.globalAlpha=1;
    bestCar.draw(carCtx, "green", true)

    carCtx.restore();
    // networkCtx.lineDashOffset=-time/50;
    // Visualizer.drawNetwork(networkCtx,bestCar.brain);
    requestAnimationFrame(animate);
}