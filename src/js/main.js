let elevatorsData = [];
let callQueue = [];

function validateForm(floorCount, elevatorCount) {
    if (floorCount < 1 || floorCount > 100) {
        alert("Floor count must be between 1 and 100");
        return false;
    }

    if (elevatorCount < 1 || elevatorCount > 15) {
        alert("Elevator count must be between 1 and 15");
        return false;
    }

    // If all conditions are met, calling add function
    add(floorCount, elevatorCount);
}
function add(floorCount, elevatorCount) {
    for (let i = parseInt(floorCount); i >= 0; i--) {
        let floordiv = document.createElement('div');
        floordiv.className = "floor"
        let buttondiv = document.createElement('div');
        let elevatorDiv = document.createElement('div');
        elevatorDiv.className = "elevatorDiv"

        let upbutton = document.createElement('button');
        upbutton.setAttribute('type', 'submit');
        upbutton.setAttribute('value', 'up');
        upbutton.setAttribute('floor', i);
        upbutton.innerHTML = 'UP';
        upbutton.className = 'up';
        upbutton.onclick = (event) => addElevatorCallRequest(event.target.getAttribute('floor'));

        let downButton = document.createElement('button');
        downButton.setAttribute('type', 'submit');
        downButton.setAttribute('value', 'down');
        downButton.setAttribute('floor', i);
        downButton.className = 'down';
        downButton.innerHTML = 'Down'
        downButton.onclick = (event) => addElevatorCallRequest(event.target.getAttribute('floor'));

        let floorLabel = document.createElement('h5');
        floorLabel.className = 'floorLabel';
        floorLabel.textContent = `Floor ${i}`;

        if (i == 0) {
            buttondiv.appendChild(upbutton)
        } else if (i == floorCount) {
            buttondiv.appendChild(downButton)
        } else {
            buttondiv.appendChild(upbutton)
            buttondiv.appendChild(downButton)
        }

        if (i === 0) {
            for (let j = 0; j < parseInt(elevatorCount); j++) {
                let elevator = document.createElement("div")
                elevator.className = 'elevator'
                elevator.setAttribute("id", j)
                //inner html is required to toggle the door close/open later
                elevator.innerHTML = `
                <div class="door left open"></div>
                <div class="door right open"></div>`;
                elevatorDiv.append(elevator)
            }
        }

        floordiv.appendChild(buttondiv)
        floordiv.appendChild(floorLabel)
        floordiv.appendChild(elevatorDiv)
        document.getElementById('elevator-system').appendChild(floordiv);
    };

    //add back button to go back to form page
    let backButton = document.createElement('button');
    backButton.setAttribute('type', 'submit');
    backButton.innerHTML = 'Back';
    backButton.onclick = () => backToInfoForm();
    document.getElementById('elevator-system').appendChild(backButton)

    document.getElementsByClassName('infoForm')[0].style.display = 'none';
    document.getElementById('elevator-system').style.display = 'block';
    defaultElevatorData()
}

function defaultElevatorData() {
    let allElevators = document.querySelectorAll('.elevator');
    for (let i = 0; i < allElevators.length; i++) {
        elevatorsData.push({
            elevatorElement: allElevators[i],
            floor: 0,
            isMoving: false,
            id: allElevators[i].getAttribute("id")
        })
    }
}

function updateElevatorData(elevator, floor, isMoving) {
    for (let i = 0; i < elevatorsData.length; i++) {
        if (elevatorsData[i].id == elevator.id) {
            elevatorsData[i].floor = floor
            elevatorsData[i].isMoving = isMoving
        }
    }
}

function addElevatorCallRequest(floor) {
    callQueue.push(floor)
    processCallRequests()
}

function processCallRequests() {
    if (callQueue.length === 0)
        return
    let availableElevators = elevatorsData.filter(x => !x.isMoving)
    if (!availableElevators.length)
        return
    //pop and get the first request in the array
    const requestedFloor = callQueue.shift();
    //get the  elevator nearest to the floor requesting it
    let nearestElevator = availableElevators.reduce(function (prev, curr) {
        return (Math.abs(curr.floor - requestedFloor) < Math.abs(prev.floor - requestedFloor) ? curr : prev);
    });
    let floorDiff = Math.abs(nearestElevator.floor - requestedFloor)
    updateElevatorData(nearestElevator, nearestElevator.floor, true)
    if (nearestElevator.floor != requestedFloor)
        moveElevator(nearestElevator.elevatorElement, requestedFloor, floorDiff)
    setTimeout(() => {
        let doors = nearestElevator.elevatorElement.children;
        for (let i = 0; i < doors.length; i++) {
            doors[i].classList.toggle("open");
        }
        setTimeout(() => {
            let doors = nearestElevator.elevatorElement.children;
            for (let i = 0; i < doors.length; i++) {
                doors[i].classList.toggle("open");
            }
            setTimeout(() => {
                updateElevatorData(nearestElevator, requestedFloor, false)
                processCallRequests()
            }, 2500) //door closes in 2.5sec
        }, 2500) //door opens in 2.5sec
    }, 2000 * floorDiff); // wait before elevator reaches floor
}

function moveElevator(nearestElevator, requestedFloor, floorDiff) {
    let elevatorElement = nearestElevator;
    const elevatorHeight = elevatorElement.offsetHeight;
    //floor height is 60px and elevator ht is 50 and keeping 1 as margin
    elevatorElement.style.transform = `translateY(-${(requestedFloor) * (elevatorHeight + 11)}px)`
    elevatorElement.style.transition = `transform ${2 * floorDiff}s ease`;
}

function backToInfoForm() {
    document.getElementById('elevator-system').replaceChildren();
    document.getElementsByClassName('infoForm')[0].style.display = 'block';
    document.getElementById('elevator-system').style.display = 'none';
}
