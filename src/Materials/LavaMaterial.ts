import { Texture, NodeMaterial, InputBlock, TransformBlock, NodeMaterialSystemValues, VertexOutputBlock, AddBlock, VectorMergerBlock, DivideBlock, AnimatedInputBlockTypes, TextureBlock, FragmentOutputBlock, Scene, ColorSplitterBlock, MultiplyBlock } from "babylonjs";

export async function LavaMaterial(texture: Texture, scene: Scene) {

    var nodeMaterial = new NodeMaterial("node", scene);

    // await nodeMaterial.loadAsync("Materials/Lava.json");
    // nodeMaterial.build(true);
    // return nodeMaterial;

    // InputBlock
    var position = new InputBlock("position");
    position.setAsAttribute("position");
    
    // TransformBlock
    var WorldPos = new TransformBlock("WorldPos");
    WorldPos.complementZ = 0;
    WorldPos.complementW = 1;
    
    // InputBlock
    var World = new InputBlock("World");
    World.setAsSystemValue(NodeMaterialSystemValues.World);
    
    // TransformBlock
    var WorldPosViewProjectionTransform = new TransformBlock("WorldPos * ViewProjectionTransform");
    WorldPosViewProjectionTransform.complementZ = 0;
    WorldPosViewProjectionTransform.complementW = 1;
    
    // InputBlock
    var ViewProjection = new InputBlock("ViewProjection");
    ViewProjection.setAsSystemValue(NodeMaterialSystemValues.ViewProjection);
    
    // VertexOutputBlock
    var VertexOutput = new VertexOutputBlock("VertexOutput");
    
    // InputBlock
    var uv = new InputBlock("uv");
    uv.setAsAttribute("uv");
    
    // AddBlock
    var Add = new AddBlock("Add");
    
    // VectorMergerBlock
    var VectorMerger = new VectorMergerBlock("VectorMerger");
    
    // DivideBlock
    var Divide = new DivideBlock("Divide");
    
    // InputBlock
    var Time = new InputBlock("Time");
    Time.value = 0;
    Time.min = 0;
    Time.max = 0;
    Time.isBoolean = false;
    Time.matrixMode = 0;
    Time.animationType = AnimatedInputBlockTypes.Time;
    Time.isConstant = false;
    Time.visibleInInspector = false;
    
    // InputBlock
    var Float = new InputBlock("Float");
    Float.value = 5;
    Float.min = 0;
    Float.max = 0;
    Float.isBoolean = false;
    Float.matrixMode = 0;
    Float.animationType = AnimatedInputBlockTypes.None;
    Float.isConstant = false;
    Float.visibleInInspector = false;
    
    // TextureBlock
    var Texture = new TextureBlock("Texture");
    Texture.texture = texture;
    Texture.convertToGammaSpace = false;
    
    // ColorSplitterBlock
    var ColorSplitter = new ColorSplitterBlock("ColorSplitter");
    
    // ColorMergerBlock
    var ColorMerger = new VectorMergerBlock("ColorMerger");
    
    // MultiplyBlock
    var Multiply = new MultiplyBlock("Multiply");
    
    // InputBlock
    var Float1 = new InputBlock("Float");
    Float1.value = 1.7;
    Float1.min = 0;
    Float1.max = 0;
    Float1.isBoolean = false;
    Float1.matrixMode = 0;
    Float1.animationType = AnimatedInputBlockTypes.None;
    Float1.isConstant = false;
    Float1.visibleInInspector = false;
    
    // FragmentOutputBlock
    var FragmentOutput = new FragmentOutputBlock("FragmentOutput");
    
    // Connections
    position.output.connectTo(WorldPos.vector);
    World.output.connectTo(WorldPos.transform);
    WorldPos.output.connectTo(WorldPosViewProjectionTransform.vector);
    ViewProjection.output.connectTo(WorldPosViewProjectionTransform.transform);
    WorldPosViewProjectionTransform.output.connectTo(VertexOutput.vector);
    uv.output.connectTo(Add.left);
    Time.output.connectTo(Divide.left);
    Float.output.connectTo(Divide.right);
    Divide.output.connectTo(VectorMerger.x);
    Divide.output.connectTo(VectorMerger.y);
    VectorMerger.xy.connectTo(Add.right);
    Add.output.connectTo(Texture.uv);
    Texture.rgba.connectTo(ColorSplitter.rgba);
    ColorSplitter.r.connectTo(ColorMerger.x);
    ColorSplitter.g.connectTo(ColorMerger.y);
    ColorSplitter.r.connectTo(Multiply.left);
    Float1.output.connectTo(Multiply.right);
    Multiply.output.connectTo(ColorMerger.y);
    ColorSplitter.a.connectTo(ColorMerger.x);
    ColorMerger.xyzw.connectTo(FragmentOutput.rgba);
    
    // Output nodes
    nodeMaterial.addOutputNode(VertexOutput);
    nodeMaterial.addOutputNode(FragmentOutput);
    nodeMaterial.build();
    
    return nodeMaterial;
}
