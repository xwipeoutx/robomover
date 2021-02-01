const OIMO = require("oimo");
import "babylonjs-loaders"
import { ArcRotateCamera, Engine, HemisphericLight, MeshBuilder, Scene, Vector3, SceneLoader, CannonJSPlugin, PhysicsImpostor, Mesh, AbstractMesh, ArcFollowCamera, ActionManager, ExecuteCodeAction, OimoJSPlugin, FollowCamera, Texture, StandardMaterial, FreeCamera, Space, ShadowGenerator, DirectionalLight, Color3, CascadedShadowGenerator, Camera, TransformNode } from "babylonjs"
import { createLevel } from "./Meshes/Level"
import { setupUI } from "./ui";

async function main() {
    const canvas = document.getElementById("view") as HTMLCanvasElement
    const engine = new Engine(canvas, true)

    const scene = new Scene(engine)

    const light = new DirectionalLight(
        "light",
        new Vector3(-1, -2, -1),
        scene);
    light.position = new Vector3(20, 40, 20);

    var lightSphere = Mesh.CreateSphere("sphere", 10, 2, scene);
    lightSphere.position = light.position;
    lightSphere.material = new StandardMaterial("light", scene);
    (lightSphere.material as StandardMaterial).emissiveColor = new Color3(1, 1, 0);

    const light2 = new DirectionalLight(
        "light2",
        new Vector3(0, -1, -0.25),
        scene);
    light2.intensity = 0.5;

    // let result = await SceneLoader.ImportMeshAsync(null, "./Models/", "GolfBall.glb", scene);

    //let ball = result.meshes[0]

    let robot = new TransformNode("Robot");
    let robotBody = MeshBuilder.CreateBox("robot-body", { size: 0.15 }, scene);
    robotBody.setParent(robot);
    robotBody.translate(Vector3.Forward(), -0.05);

    let pen = MeshBuilder.CreateCylinder("pen", { height: 0.12, diameterBottom: 0.003, diameterTop: 0.02});
    pen.setParent(robot);
    pen.translate(Vector3.Forward(), 0.13, Space.LOCAL)

    robot.translate(Vector3.Up(), 0.25); // the floor width
    robot.translate(Vector3.Up(), 0.075); // the robot height

    let lavaTexture = new Texture("./Textures/lava-magma-seamless-texture-free.jpg", scene);
    let lavaMaterial = new StandardMaterial("Ball", scene);
    lavaMaterial.diffuseTexture = lavaTexture;
    robotBody.material = lavaMaterial;
    pen.material = lavaMaterial;

    let cam = new ArcRotateCamera(
        "camera",
        -Math.PI / 4,
        3 * Math.PI / 8,
        1,
        robot.position,
        scene);
        cam.minZ = 0.01;

    cam.attachControl(canvas);
    cam.zoomOnFactor = 0.1;

    var level = createLevel(scene)
    level.getChildMeshes(false).forEach(m => m.receiveShadows = true);
    level.receiveShadows = true;
    var shadowGenerator = new CascadedShadowGenerator(2048, light);
    shadowGenerator.addShadowCaster(robotBody, true);
    shadowGenerator.addShadowCaster(pen, true);
    shadowGenerator.bias = 0.00002;
    shadowGenerator.lambda = 1;
    shadowGenerator.autoCalcDepthBounds = true;
    scene.debugLayer.show();

    setupUI(scene, robot, pen);

    engine.runRenderLoop(() => {
        scene.render();
    })
}
main();
