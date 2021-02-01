import { Scene, TransformNode } from "babylonjs";
import { isSimulating, stopSimulation, startSimulation, Instruction } from "./simulation";

export function setupUI(scene: Scene, ball: TransformNode, pen: TransformNode) {
    let playPause = document.getElementById('playPauseButton') as HTMLButtonElement;
    let forwardButton = document.getElementById('forwardButton') as HTMLButtonElement;
    let leftButton = document.getElementById('leftButton') as HTMLButtonElement;
    let rightButton = document.getElementById('rightButton') as HTMLButtonElement;
    let clearButton = document.getElementById('clearButton') as HTMLButtonElement;
    let instructionElement = document.getElementById('instructions') as HTMLDivElement;

    let instructions: Instruction[] = ['F', 'F', 'L', 'F', 'R', 'R', 'R'];
    renderUi();
    
    playPause.addEventListener('click', () => {
        if (isSimulating()) {
            stopSimulation();
        } else {
            startSimulation(scene, instructions, ball, pen);
        }
        renderUi();
    });

    wireUpInstruction(forwardButton, 'F');
    wireUpInstruction(leftButton, 'L');
    wireUpInstruction(rightButton, 'R');

    clearButton.addEventListener("click", () => {
        instructions = [];
        stopSimulation();
        renderUi();
    })

    function wireUpInstruction(button: HTMLButtonElement, instruction: Instruction) {        
        button.addEventListener('click', () => {
            stopSimulation();
            instructions.push(instruction);
            renderUi();
        });
    }

    function renderUi() {
        playPause.innerText = isSimulating() ? "Stop" : "Start";
        instructionElement.innerText = instructions.join("\n");
    }
}