import { _decorator, Component, Node, Label, director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('NumberGenerator')
export class NumberGenerator extends Component {

    start() {
        this.fetchUniqueNumbers(25, 1, 75);
    }

    fetchUniqueNumbers(count: number, min: number, max: number) {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", `http://localhost:3000/generateNumbers?count=${count}&min=${min}&max=${max}`, true);
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                const numbers = JSON.parse(xhr.responseText);
                console.log(numbers);
                // 在这里使用返回的数字列表初始化游戏
            }
        };
        xhr.send();
    }
}
