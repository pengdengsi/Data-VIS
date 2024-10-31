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

// 创建每条连线的粗细度
const lineWidths = [
    { from: 0, to: 1, width: 1 },
    { from: 0, to: 2, width: 3 },
    { from: 0, to: 3, width: 6 },
    { from: 0, to: 4, width: 7 },
    { from: 1, to: 2, width: 15 },
    { from: 1, to: 3, width: 1 },
    { from: 1, to: 4, width: 3 },
    { from: 2, to: 3, width: 6 },
    { from: 2, to: 4, width: 7 },
    { from: 3, to: 4, width: 15 }
];

// 计算节点的位置
for (let i = 0; i < numSides; i++) {
    const x = centerX + radius * Math.cos(i * angles);
    const y = centerY + radius * Math.sin(i * angles);
    nodes.push({ id: customNodes[i].name, x, y, color: customNodes[i].color });
}

function drawEdges(highlightedNodeIndex) {
    lineWidths.forEach(line => {
        const { from, to, width } = line;
        ctx.beginPath();
        ctx.moveTo(nodes[from].x, nodes[from].y);
        ctx.lineTo(nodes[to].x, nodes[to].y);
        
        ctx.lineWidth = width;
        ctx.strokeStyle = 'black';
        ctx.stroke();
    });

    if (highlightedNodeIndex !== null) {
        for (let i = 0; i < nodes.length; i++) {
            if (i === highlightedNodeIndex) continue;
    
            // 查找当前节点和高亮节点之间的边的宽度
            const line = lineWidths.find(line => (line.from === highlightedNodeIndex && line.to === i) || (line.from === i && line.to === highlightedNodeIndex));
            const originalWidth = line ? line.width : 1; // 默认宽度为1
    
            ctx.beginPath();
            ctx.moveTo(nodes[highlightedNodeIndex].x, nodes[highlightedNodeIndex].y);
            ctx.lineTo(nodes[i].x, nodes[i].y);
            ctx.lineWidth = originalWidth; // 使用原本的边宽
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
