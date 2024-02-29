import { _decorator, Component, Node, Label, Sprite, Color } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BingoGenerator')
export class BingoGenerator extends Component {
    @property(Node)
    gridParent: Node = null; // 网格的父节点
    @property(Label)
    drawnNumberLabel: Label = null; // 用于显示抽取数字的 Label 组件

    private websocket: WebSocket | null = null;

    start() {
        this.generateGrid();
    }

    onLoad() {
        this.connectWebSocket();
    }

    connectWebSocket() {
        this.websocket = new WebSocket('ws://localhost:8080');

        this.websocket.onopen = (event) => {
            console.log('Connected to WebSocket server');
        };

        this.websocket.onmessage = (event) => {
            console.log("Message received:", event.data); // 确认收到消息
            const data = JSON.parse(event.data);
            const newNumber = data.number;
            this.drawnNumberLabel.string = `${newNumber}`;
            this.updateGridColor(newNumber);
            this.checkForBingo();
        };

        this.websocket.onerror = (event) => {
            console.error('WebSocket error:', event);
        };

        this.websocket.onclose = (event) => {
            console.log('WebSocket connection closed');
        };
    }

    generateGrid() {
        // 生成 1 到 99 的不重复随机数字，因为你有 25 个格子
        const numbers = this.generateUniqueNumbers(25, 1, 75);

        // 遍历 gridParent 的所有子节点（即 25 个 Sprite）
        for (let i = 0; i < this.gridParent.children.length; i++) {
            let spriteNode = this.gridParent.children[i]; // 获取每个 Sprite 节点

            // 获取 Sprite 节点内的 Label 组件并设置数字
            let label = spriteNode.getComponentInChildren(Label);
            if (label) {
                label.string = numbers[i].toString();
            }
        }
    }

    generateUniqueNumbers(count: number, min: number, max: number): number[] {
        let availableNumbers = [];
        for (let i = min; i <= max; i++) {
            availableNumbers.push(i);
        }

        let uniqueNumbers = [];
        while (uniqueNumbers.length < count) {
            let randomIndex = Math.floor(Math.random() * availableNumbers.length);
            uniqueNumbers.push(availableNumbers[randomIndex]);
            availableNumbers.splice(randomIndex, 1); // 从可用数字中移除已选择的数字，确保数字的唯一性
        }

        return uniqueNumbers;
    }



    updateGridColor(number: number) {
        for (let i = 0; i < this.gridParent.children.length; i++) {
            let spriteNode = this.gridParent.children[i];
            let label = spriteNode.getComponentInChildren(Label);

            if (label && parseInt(label.string) === number) {
                let sprite = spriteNode.getComponent(Sprite);
                if (sprite) {
                    sprite.color = Color.RED; // 将格子颜色设置为红色
                }
            }
        }
    }

    checkForBingo() {
        const gridSize = Math.sqrt(this.gridParent.children.length); // 假设网格是正方形
        let lines = []; // 用于存储所有可能的连线

        // 检查水平连线
        for (let i = 0; i < gridSize; i++) {
            let line = [];
            for (let j = 0; j < gridSize; j++) {
                line.push(this.gridParent.children[i * gridSize + j]);
            }
            lines.push(line);
        }

        // 检查垂直连线
        for (let i = 0; i < gridSize; i++) {
            let line = [];
            for (let j = 0; j < gridSize; j++) {
                line.push(this.gridParent.children[j * gridSize + i]);
            }
            lines.push(line);
        }

        // 检查对角线连线
        let diagonal1 = [], diagonal2 = [];
        for (let i = 0; i < gridSize; i++) {
            diagonal1.push(this.gridParent.children[i * gridSize + i]);
            diagonal2.push(this.gridParent.children[i * gridSize + (gridSize - i - 1)]);
        }
        lines.push(diagonal1, diagonal2);

        // 检查每条线是否为连线，并更新颜色
        lines.forEach(line => {
            if (line.every(node => node.getComponent(Sprite).color.equals(Color.RED))) {
                line.forEach(node => node.getComponent(Sprite).color = Color.GREEN);
            }
        });
    }

}
