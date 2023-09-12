// ==UserScript==
// @name         chatgpt-export
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add a copy button next to LaTeX formulas
// @author       You
// @match        https://chat.openai.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // const clipboardSVG = `<svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="clipboard" class="svg-inline--fa fa-clipboard fa-w-12" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="currentColor" d="M320 64h-64V48c0-26.5-21.5-48-48-48H176c-26.5 0-48 21.5-48 48v16H64C28.65 64 0 92.65 0 128v352c0 35.35 28.65 64 64 64h256c35.35 0 64-28.65 64-64V128c0-35.35-28.65-64-64-64zm-48 0v-16c0-8.837-7.163-16-16-16H176c-8.837 0-16 7.163-16 16v16H48c-8.822 0-16 7.178-16 16v352c0 8.822 7.178 16 16 16h288c8.822 0 16-7.178 16-16V80c0-8.822-7.178-16-16-16z"></path></svg>`;
    // const clipboardCheckSVG = `<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="clipboard-check" class="svg-inline--fa fa-clipboard-check fa-w-12" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="currentColor" d="M320 64h-64V48c0-26.5-21.5-48-48-48H176C149.5 0 128 21.5 128 48v16H64C28.65 64 0 92.65 0 128v352c0 35.35 28.65 64 64 64h256c35.35 0 64-28.65 64-64V128c0-35.35-28.65-64-64-64zm10.75 267.1l-131.1 131c-4.7 4.7-12.3 4.7-17 0l-59.1-59.1c-4.7-4.7-4.7-12.3 0-17l17-17c4.7-4.7 12.3-4.7 17 0l35.7 35.7 94.1-94.1c4.7-4.7 12.3-4.7 17 0l17 17c4.8 4.7 4.8 12.3 .1 17z"></path></svg>`;

    let debounceTimer;

    const addCopyButtons = () => {
        const mathDivs = document.querySelectorAll('.math, .math-inline, .math-display');
        mathDivs.forEach(div => {
            if (div.getAttribute('data-copy-button-added') === 'true') return;
            div.setAttribute('data-copy-button-added', 'true');

            const annotation = div.querySelector('annotation[encoding="application/x-tex"]');
            if (annotation) {
                const latexText = annotation.textContent;
                const copyButton = document.createElement('span');
                copyButton.innerText = "Copy";
                // copyButton.innerHTML = `${clipboardSVG} Copy`;
                copyButton.className = 'copy-button';
                copyButton.style.color = 'grey';
                copyButton.style.fontSize = 'small';

                if (div.classList.contains('math-display')) {
                    copyButton.style.position = 'absolute';
                    copyButton.style.top = '0';
                    copyButton.style.right = '0';
                    copyButton.style.zIndex = '1';
                    div.style.position = 'relative';
                    div.appendChild(copyButton);
                } else if (div.classList.contains('math-inline')) {
                    copyButton.style.marginLeft = '5px';
                    div.parentNode.insertBefore(copyButton, div.nextSibling);
                }

                copyButton.addEventListener('click', () => {
                    navigator.clipboard.writeText(latexText).then(() => {
                        console.log('复制成功！');
                    }).catch(err => {
                        console.error('复制失败:', err);
                    });
                });
            }
        });
    };

    const debounceAddCopyButtons = () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(addCopyButtons, 300);
    };

    addCopyButtons();  // Run once initially

    const observer = new MutationObserver(() => {
        console.log("DOM has changed, rechecking...");
        debounceAddCopyButtons();
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();

