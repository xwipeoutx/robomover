const OIMO = require("oimo");
import "babylonjs-loaders"
import { ArcRotateCamera, Engine, HemisphericLight, MeshBuilder, Scene, Vector3, SceneLoader, CannonJSPlugin, PhysicsImpostor, Mesh, AbstractMesh, ArcFollowCamera, ActionManager, ExecuteCodeAction, OimoJSPlugin, FollowCamera, Texture, StandardMaterial, FreeCamera, Space, ShadowGenerator, DirectionalLight, Color3, CascadedShadowGenerator, Camera } from "babylonjs"
import { SampleMaterial } from "./Materials/SampleMaterial"
import { createLevel } from "./Meshes/Level"
import { LavaMaterial } from "./Materials/LavaMaterial";
import { isSimulating, startSimulation, stopSimulation } from "./simulation";
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

    let ball = MeshBuilder.CreateSphere("ball", { diameter: 0.3 }, scene);
    ball.translate(Vector3.Up(), 0.4);

    let lavaTexture = new Texture("./Textures/lava-magma-seamless-texture-free.jpg", scene);
    let ballMaterial = new StandardMaterial("Ball", scene);
    ballMaterial.diffuseTexture = lavaTexture;
    ball.material = ballMaterial;
    ball.receiveShadows = true;
    //    await LavaMaterial(lavaTexture, scene);

    // scene.shadowsEnabled = true;

    let cam = new ArcRotateCamera(
        "camera",
        -Math.PI / 4,
        3 * Math.PI / 8,
        6,
        ball.position,
        scene);

    cam.attachControl(canvas);

    var level = createLevel(scene)
    level.getChildMeshes(false).forEach(m => m.receiveShadows = true);
    level.receiveShadows = true;
    var shadowGenerator = new CascadedShadowGenerator(2048, light);
    shadowGenerator.addShadowCaster(ball, true);
    shadowGenerator.bias = 0.00002;
    shadowGenerator.lambda = 1;
    shadowGenerator.autoCalcDepthBounds = true;
    scene.debugLayer.show();

    setupUI(scene, ball);

    engine.runRenderLoop(() => {
        scene.render();
    })
}
main();
