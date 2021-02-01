import { Color3, Mesh, Observer, Scene, Space, StandardMaterial, TrailMesh, TransformNode, Vector3 } from "babylonjs";

const fwdSpeed = 0.2;
const rotateSpeed = Math.PI / 4;
const fwdSpeedWhenRotate = 0.05;
const simulationSpeed = 4;

export type Instruction = "F" | "L" | "R";
let currentObs: Observer<Scene> | undefined;
let trailMesh: TrailMesh | undefined;

export function isSimulating() {
    return !!currentObs;
}

export function stopSimulation() {
    if (!currentObs)
        return;
    currentObs.unregisterOnNextCall = true;
    currentObs = undefined;
}

export function startSimulation(scene: Scene, instructions: Instruction[], robot: TransformNode, pen: TransformNode) {
    if (!instructions.length)
        return;
    let frame = 0;
    currentObs = scene.onBeforeRenderObservable.add(stepSimulation);
    robot.position = new Vector3(0, robot.position.y, 0);
    robot.rotation = new Vector3(0,0,0);

    let lineMat = new StandardMaterial("Line Material", scene);
    lineMat.emissiveColor = Color3.Purple();
    lineMat.diffuseColor = Color3.Red();

    if (trailMesh) {
        trailMesh.dispose();
        trailMesh = null;
    }

    function addTrail() {
        let trail = new TrailMesh("Trail", pen, scene, 0.01, 5000, true);
        trail.translate(Vector3.Down(), 0.07);
        trail.material = new StandardMaterial("Trail Material", scene);
        (trail.material as StandardMaterial).emissiveColor = Color3.Yellow();
        (trail.material as StandardMaterial).diffuseColor = Color3.Black();
        return trail;
    }

    function stepSimulation() {
        let dt = (scene.deltaTime / 1000) * simulationSpeed;
        if (dt > 1 || !dt)
            return;

        const prevPos = robot.position;
        frame += dt;
        var instruction = instructions[Math.floor(frame) % instructions.length];

        switch (instruction) {
            case "F":
                robot.translate(Vector3.Forward(), fwdSpeed * dt, Space.LOCAL);
                break;
            case "L":
                robot.rotate(Vector3.Up(), -rotateSpeed * dt * Math.PI / 4, Space.LOCAL);
                break;
            case "R":
                robot.rotate(Vector3.Up(), rotateSpeed * dt * Math.PI / 4, Space.LOCAL);
                break;
            default:
                let x: never = cannotHappen(instruction);
        }

        const nextPos = robot.position;
        
        //let line = Mesh.CreateLines("Line", [prevPos, nextPos]);
        //line.color = Color3.Purple();

        // line.setParent(currentLineRoot);

        if (Math.abs(robot.position.x) > 5 || Math.abs(robot.position.z) > 5) {
            stopSimulation();
        }

        // Trail mesh, sadly, remembers the position at frame -1, even with updating caches and junk :(
        if (!trailMesh && frame > 0.2)
            trailMesh = addTrail();
    }
}

export function cannotHappen(x: never): never {
    throw new Error("This should never happen");
}