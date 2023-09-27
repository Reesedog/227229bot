// ==UserScript==
// @name         227229 bot test
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  很喜欢jg的一句话，明天下午东南亚单排
// @author       Reesedog
// @match        https://www.douyu.com/227229*
// @grant        none
// @license MIT
// ==/UserScript==

(function () {
  "use strict";

  // 弹幕模板部分 ==============================================================================================================
  // 定义弹幕模板
  const templates = [
    "一直为这些五千分的细节沾沾自喜，我",
    "（不可思议）（假装自责），（自暴自弃）（切屏封人）",
    "下一个搞 吗，收到鸡哥收到",
    "第一天，第二天，第三天，4000+",
    "唔，",
    // "(emoji+词语)x5",
    // 根据需要添加更多模板
  ];

  const usernames = [
    "ameame",
    "setsu",
    "ctyzzz",
    "azi",
    // 根据需要添加更多模板
  ];

  // 创建浮动窗口
  let floatWindow = document.createElement("div");
  floatWindow.style.display = "flex";
  floatWindow.style.position = "fixed";
  floatWindow.style.top = "50%";
  floatWindow.style.right = "0";
  floatWindow.style.transform = "translateY(-50%)";
  floatWindow.style.backgroundColor = "white";
  floatWindow.style.border = "1px solid black";
  floatWindow.style.padding = "10px";
  floatWindow.style.zIndex = "10000";
  document.body.appendChild(floatWindow);

  // 创建浮窗容器
  let contentContainer = document.createElement("div");
  contentContainer.style.paddingTop = "5px";
  contentContainer.style.display = "none";
  floatWindow.appendChild(contentContainer);

  // 创建下拉菜单
  let template = document.createElement("select");

  // 添加占位符选项
  let placeholderOption = document.createElement("option");
  placeholderOption.value = "";
  placeholderOption.textContent = "弹幕模板";
  placeholderOption.disabled = true;
  placeholderOption.selected = true;
  template.appendChild(placeholderOption);

  // 添加模板选项
  templates.forEach((template) => {
    let option = document.createElement("option");
    option.value = template;
    option.textContent = template;
    template.appendChild(option);
  });
  contentContainer.appendChild(template);

  // 创建cosplay下拉菜单
  let cosplay = document.createElement("select");

  // 添加cosplay占位符选项
  let cosplayPlaceHolder = document.createElement("option");
  cosplayPlaceHolder.value = "";
  cosplayPlaceHolder.textContent = "cosplay";
  cosplayPlaceHolder.disabled = true;
  cosplayPlaceHolder.selected = true;
  cosplay.appendChild(cosplayPlaceHolder);

  // 添加cosplay选项
  usernames.forEach((username) => {
    let option = document.createElement("option");
    option.value = username;
    option.textContent = username;
    cosplay.appendChild(option);
  });
  // contentContainer.appendChild(cosplay);

  // 创建输入框
  let inputField = document.createElement("input");
  inputField.type = "text";
  inputField.style.width = "200px";
  inputField.style.marginLeft = "10px";
  contentContainer.appendChild(inputField);

  // 创建发送按钮
  let sendButton = document.createElement("button");
  sendButton.textContent = "发送";
  sendButton.style.marginLeft = "10px";
  sendButton.style.paddingLeft = "10px";
  sendButton.style.paddingRight = "10px";
  sendButton.style.border = "1px solid black";
  contentContainer.appendChild(sendButton);

  // 创建折叠/展开按钮
  let toggleButton = document.createElement("button");
  toggleButton.textContent = "🤡";
  toggleButton.style.backgroundColor = "orange";
  toggleButton.style.border = "none";
  toggleButton.style.color = "white";
  toggleButton.style.fontSize = "16px";
  toggleButton.style.padding = "0px 10px 5px 10px";
  toggleButton.style.cursor = "pointer";
  toggleButton.style.marginLeft = "10px";
  floatWindow.appendChild(toggleButton);

  // 定义发送弹幕的函数
  function sendDanmu(content) {
    let textarea = document.querySelector("textarea.ChatSend-txt");
    if (textarea) {
      textarea.value = content;
      textarea.focus();
      let sendButton = document.querySelector(".ChatSend-button");
      if (sendButton) {
        sendButton.click(); // 点击发送按钮提交弹幕
      }
    }
  }

  // 发送按钮点击事件
  sendButton.onclick = function () {
    sendDanmu(cosplay.value + "：" + inputField.value);
  };

  // 下拉菜单变更事件
  template.onchange = function () {
    inputField.value = template.value;
  };

  // 折叠/展开按钮点击事件
  toggleButton.onclick = function () {
    if (contentContainer.style.display === "none") {
      contentContainer.style.display = "block";
      toggleButton.textContent = "x";
    } else {
      contentContainer.style.display = "none";
      toggleButton.textContent = "🤡";
    }
  };

  // 拖动逻辑
  let isDragging = false;
  let mouseDownX, mouseDownY, initX, initY;
  let mouse_throttle_flag = false;
  let mouse_throttle;

  floatWindow.onmousedown = function (e) {
    if (contentContainer.style.display === "none") {
      // 如果窗口是折叠状态，允许拖动
      isDragging = true;
      mouseDownX = e.pageX;
      mouseDownY = e.pageY;
      initX = floatWindow.offsetLeft;
      initY = floatWindow.offsetTop;

      // 禁止文本选择
      document.body.style.userSelect = "none";

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    }
  };

  function onMouseMove(e) {
    if (isDragging) {
      if (!mouse_throttle_flag) {
        mouse_throttle_flag = true;
        mouse_throttle = setTimeout(() => {
          mouse_throttle_flag = false;
          let mouseMoveX = e.pageX,
            mouseMoveY = e.pageY;
          floatWindow.style.right =
            window.innerWidth - mouseMoveX + mouseDownX - initX - 70 + "px";
          floatWindow.style.top = mouseMoveY - mouseDownY + initY + "px";
          floatWindow.style.transform = "none";
        }, 5);
      }
    }
  }

  function onMouseUp() {
    isDragging = false;

    // 恢复文本选择
    document.body.style.userSelect = "";

    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  }

  // +1 部分 ==============================================================================================================
  function addButtonToContainer() {
    // 查找按钮容器
    let container = document.querySelector(".btnscontainer-4e2ed0");
    if (!container) return;

    // 检查容器中是否已经存在 +1 按钮
    if (container.querySelector(".plus-one-button")) return;

    // 创建一个分隔符
    let separator = document.createElement("p");
    separator.className = "sugun-e3fbf6";
    separator.textContent = "|";
    container.appendChild(separator);

    // 以与现有按钮相同的样式创建 +1 按钮
    let button = document.createElement("div");
    button.className = "labelfisrt-407af4 plus-one-button"; // 为 +1 按钮添加一个特定的类名
    button.textContent = "+1";
    container.appendChild(button);

    // 为 +1 按钮设置点击事件
    button.onclick = function () {
      let textContent =
        hoveredElement.querySelector(".text-edf4e7").textContent;
      sendDanmu(textContent);
    };
  }

  let hoveredElement = null;

  // 当鼠标悬停在具有特定类的元素上时，显示 +1 按钮
  document.addEventListener("mouseover", function (event) {
    // 检查容器中是否已经存在 +1 按钮，防止hoverElement不一致
    let container = document.querySelector(".btnscontainer-4e2ed0");
    if (container.querySelector(".plus-one-button")) return;

    if (event.target.classList.contains("danmuItem-f8e204")) {
      hoveredElement = event.target;
      addButtonToContainer();
    }
  });

  // 防复读部分 ==============================================================================================================
  // 创建一个数组用于维护弹幕的顺序
  const danmuArray = [];

  // 初始化弹幕屏蔽状态
  let blockDanmu = false;

  // 创建按钮
  const button = document.createElement("div");
  button.style.position = "fixed";
  button.style.right = "0";
  button.style.bottom = "40%";
  button.style.backgroundColor = "orange";
  button.style.padding = "10px";
  button.style.cursor = "pointer";
  button.style.zIndex = "10000";
  button.textContent = "屏蔽复读";
  document.body.appendChild(button);

  // 为按钮添加点击事件监听器
  button.addEventListener("click", () => {
    blockDanmu = !blockDanmu;
    button.textContent = blockDanmu ? "开启复读" : "屏蔽复读";
  });

  // 定义一个函数，用于开始观察弹幕容器
  function observeDanmuContainer() {
    const danmuContainer = document.querySelector(".comment-37342a");
    if (danmuContainer) {
      // 创建 MutationObserver 实例，用于观察弹幕容器的变化
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const textElement = node.querySelector(".text-edf4e7");
              if (textElement) {
                const danmuText = textElement.textContent;
                if (blockDanmu && danmuArray.includes(danmuText)) {
                  // 如果弹幕已经出现过，则隐藏该弹幕
                  node.style.display = "none";
                } else {
                  // 如果 danmuArray 的长度达到了 50，则删除最旧的弹幕
                  if (danmuArray.length >= 50) {
                    danmuArray.shift();
                  }
                  // 将新弹幕添加到数组中
                  danmuArray.push(danmuText);
                }
              }
            }
          });
        });
      });

      // 配置观察器选项
      const config = { childList: true, subtree: true, attributes: true };

      // 开始观察弹幕容器
      observer.observe(danmuContainer, config);

      // 清除定时器，停止尝试观察
      clearInterval(intervalId);
    }
  }

  // 每隔一秒尝试开始观察弹幕容器
  const intervalId = setInterval(observeDanmuContainer, 1000);

  // 防复读部分 ==============================================================================================================

  // 创建折跃按钮
  const tpButton = document.createElement("div");
  tpButton.style.position = "fixed";
  tpButton.style.right = "0";
  tpButton.style.bottom = "30%";
  tpButton.style.backgroundColor = "orange";
  tpButton.style.padding = "10px";
  tpButton.style.cursor = "pointer";
  tpButton.style.zIndex = "10000";
  tpButton.textContent = "下播折跃";
  document.body.appendChild(tpButton);

  // 为按钮添加点击事件监听器
  tpButton.addEventListener("click", () => {
    sendDanmu("下播4000+");
    // todo: href
  });

  // todo: 下播自动发送下播4000+并跳转白石直播间
})();
