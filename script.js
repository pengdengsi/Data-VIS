const canvas = document.getElementById('networkCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 400;
canvas.height = 400;

const numSides = 5;
const radius = 100;
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

// 自定义节点名称和颜色（改为浅色）
const customNodes = [
    { name: '变量1', color: '#ffcccc' }, // 浅红色
    { name: '变量2', color: '#ccffcc' }, // 浅绿色
    { name: '变量3', color: '#ccccff' }, // 浅蓝色
    { name: '变量4', color: '#ffffcc' }, // 浅黄色
    { name: '变量5', color: '#ffcc99' }  // 浅橙色
];

const nodes = [];
const angles = (2 * Math.PI) / numSides;

// 创建连线粗细度的数值集
const lineWidths = [1, 3, 6, 7, 15]; // 每条线段的粗细度

for (let i = 0; i < numSides; i++) {
    const x = centerX + radius * Math.cos(i * angles);
    const y = centerY + radius * Math.sin(i * angles);
    nodes.push({ id: customNodes[i].name, x, y, color: customNodes[i].color });
}

function drawEdges(highlightedNodeIndex) {
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            
            // 根据边的索引选择粗细度
            const lineWidthIndex = (i + j) % lineWidths.length; // 使用 i 和 j 的和的模来选择粗细度
            ctx.lineWidth = lineWidths[lineWidthIndex];
            ctx.strokeStyle = 'gray';
            ctx.stroke();
        }
    }

    if (highlightedNodeIndex !== null) {
        for (let i = 0; i < nodes.length; i++) {
            if (i === highlightedNodeIndex) continue;

            // 计算高亮线的宽度
            const lineWidthIndex = (highlightedNodeIndex + i) % lineWidths.length; 
            ctx.beginPath();
            ctx.moveTo(nodes[highlightedNodeIndex].x, nodes[highlightedNodeIndex].y);
            ctx.lineTo(nodes[i].x, nodes[i].y);
            ctx.lineWidth = lineWidths[lineWidthIndex]; // 使用相同的线宽
            ctx.strokeStyle = 'orange';
            ctx.stroke();
        }
    }
}

// Draw nodes
function drawNodes(highlightedNodeIndex) {
    nodes.forEach((node, index) => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, 25, 0, Math.PI * 2);
        ctx.fillStyle = (highlightedNodeIndex === index) ? 'orange' : node.color;
        ctx.fill();

        // 设置字体样式和大小
        ctx.font = '12px 微软雅黑'; // 字体大小和类型
        ctx.textAlign = 'center'; // 水平居中
        ctx.fillStyle = 'black';
        ctx.fillText(node.id, node.x, node.y + 5); // 文本位置调整
    });
}

// Initial draw
let highlightedNodeIndex = null;

function drawNetwork() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawEdges(highlightedNodeIndex);
    drawNodes(highlightedNodeIndex);
}

// Check if mouse is over a node
function getNodeAtMouse(mouseX, mouseY) {
    for (let i = 0; i < nodes.length; i++) {
        const dx = mouseX - nodes[i].x;
        const dy = mouseY - nodes[i].y;
        if (Math.sqrt(dx * dx + dy * dy) < 20) {
            return i;
        }
    }
    return null;
}

// Mouse click event
canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const clickedNodeIndex = getNodeAtMouse(mouseX, mouseY);
    highlightedNodeIndex = (clickedNodeIndex !== null && highlightedNodeIndex === clickedNodeIndex) 
                           ? null 
                           : clickedNodeIndex;

    drawNetwork();
});

// Initial drawing of the network
drawNetwork();
