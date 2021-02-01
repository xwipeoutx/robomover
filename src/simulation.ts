import { Observer, Scene, Space, TransformNode, Vector3 } from "babylonjs";

const fwdSpeed = 0.2;
const rotateSpeed = Math.PI / 4;
const fwdSpeedWhenRotate = 0.05;
const simulationSpeed = 4;

export type Instruction = "F" | "L" | "R";
let currentObs: Observer<Scene> | undefined;

export function isSimulating() {
    return !!currentObs;
}

export function stopSimulation() {
    if (!currentObs)
        return;
    currentObs.unregisterOnNextCall = true;
    currentObs = undefined;
}

export function startSimulation(scene: Scene, instructions: Instruction[], ball: TransformNode) {
    let frame = 0;
    currentObs = scene.onBeforeRenderObservable.add(stepSimulation);
    ball.position = new Vector3(0, 0.4, 0);
    ball.rotation = new Vector3(0,0,0);

    function stepSimulation() {
        let dt = (scene.deltaTime / 1000) * simulationSpeed;
        if (dt > 1 || !dt)
            return;
        frame += dt;
        if (!frame)
            frame = 0;

        var instruction = instructions[Math.floor(frame) % instructions.length];

        switch (instruction) {
            case "F":
                ball.translate(Vector3.Forward(), fwdSpeed * dt, Space.LOCAL);
                break;
            case "L":
                ball.rotate(Vector3.Up(), -rotateSpeed * dt * Math.PI / 4, Space.LOCAL);
                break;
            case "R":
                ball.rotate(Vector3.Up(), rotateSpeed * dt * Math.PI / 4, Space.LOCAL);
                break;
            default:
                let x: never = cannotHappen(instruction);
        }

        if (Math.abs(ball.position.x) > 5 || Math.abs(ball.position.z) > 5) {
            stopSimulation();
        }
    }
}

export function cannotHappen(x: never): never {
    throw new Error("This should never happen");
}