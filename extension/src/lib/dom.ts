/**
 * 获取共同的祖先 DOM 父节点
 * @param doms
 * @returns
 */
export function getSharedParent(doms: Node[]): Node | null {
    if (doms.length === 0) return null;
    if (doms.length === 1) return doms[0].parentNode; // Return parentNode for single element as per common use case, or doms[0] if element itself is considered an ancestor
    let ancestor = doms[0].parentNode;
    for (let i = 1; i < doms.length; i++) {
        if (!ancestor) return null; // No common ancestor if any element's parent chain is exhausted
        let current = doms[i];
        while (current.parentNode) {
            if (current.parentNode === ancestor) {
                break; // Found common ancestor for this element
            }
            current = current.parentNode;
        }
        // If the loop finished and current.parentNode is not ancestor, it means ancestor is not an ancestor of doms[i]
        // We need to move ancestor up its own chain
        if (current.parentNode !== ancestor) {
            ancestor = ancestor.parentNode;
            i = 0; // Restart the check from the beginning with the new (higher) ancestor
        }
    }
    return ancestor;
}
/**
 * 获取第一个 HtmlElement 元素的父节点
 */
export function getHtmlElementParent(dom: Node): HTMLElement | null {
    let parent = dom.parentNode;
    while (parent) {
        if (parent instanceof HTMLElement) {
            return parent;
        }
        parent = parent.parentNode;
    }
    return null;
}
/**
 * 获取选中区域的元素（共同父元素）
 */
export function getSelectionDOM() {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return;
    const selectedText = selection.toString().trim();
    if (!selectedText) return;
    const range = selection.getRangeAt(0);
    let commonAncestor = range.commonAncestorContainer;
    // If commonAncestor is a text node, get its parent element
    if (commonAncestor.nodeType === Node.TEXT_NODE) {
        commonAncestor = commonAncestor.parentElement as HTMLElement;
    }
    // Ensure we have an HTMLElement
    if (!(commonAncestor instanceof HTMLElement)) {
        // Fallback to document.body or a more specific element if possible
        // This case might need more sophisticated handling depending on where selections can occur
        console.warn(
            "Text selection common ancestor is not an HTMLElement.",
            commonAncestor,
        );
        // As a fallback, try to get the element from the start or end of the range if they are elements
        if (range.startContainer instanceof HTMLElement) {
            commonAncestor = range.startContainer;
        } else if (range.endContainer instanceof HTMLElement) {
            commonAncestor = range.endContainer;
        } else {
            // If still not an element, we might not be able to get a meaningful selector
            // For now, let's skip if we can't identify a clear target element
            return;
        }
    }
    return commonAncestor;
}