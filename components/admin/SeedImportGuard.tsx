'use client';

import { useEffect } from 'react';

const CONFIRMATION_PHRASE = 'ЗАМЕНИТЬ МЕНЮ';
const SEED_BUTTON_TEXT = 'Загрузить seed-меню';
const GUARD_ATTRIBUTE = 'data-seed-import-guard';
const BYPASS_ATTRIBUTE = 'data-seed-import-confirmed';

const isSeedImportButton = (element: Element | null): element is HTMLButtonElement => {
  if (!(element instanceof HTMLButtonElement)) return false;
  return element.textContent?.includes(SEED_BUTTON_TEXT) ?? false;
};

const findSeedImportButton = () => {
  return Array.from(document.querySelectorAll('button')).find(isSeedImportButton) ?? null;
};

const attachPhraseHint = (button: HTMLButtonElement) => {
  if (button.parentElement?.querySelector(`[${GUARD_ATTRIBUTE}]`)) return;

  const hint = document.createElement('button');
  hint.type = 'button';
  hint.setAttribute(GUARD_ATTRIBUTE, 'true');
  hint.setAttribute('aria-label', `Фраза подтверждения: ${CONFIRMATION_PHRASE}`);
  hint.title = `Фраза подтверждения: ${CONFIRMATION_PHRASE}`;
  hint.textContent = '?';
  hint.className =
    'relative inline-flex h-9 w-9 items-center justify-center border border-red-500/40 text-sm font-semibold text-red-600 hover:bg-red-50';

  hint.addEventListener('click', () => {
    window.alert(`Фраза подтверждения для замены меню:\n\n${CONFIRMATION_PHRASE}`);
  });

  button.insertAdjacentElement('afterend', hint);
};

export default function SeedImportGuard() {
  useEffect(() => {
    const syncHint = () => {
      const button = findSeedImportButton();
      if (button) attachPhraseHint(button);
    };

    const handleClick = (event: MouseEvent) => {
      const button = (event.target as Element | null)?.closest('button');
      if (!isSeedImportButton(button)) return;

      if (button.getAttribute(BYPASS_ATTRIBUTE) === 'true') {
        button.removeAttribute(BYPASS_ATTRIBUTE);
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      const enteredPhrase = window.prompt(
        `Опасное действие: живое меню будет заменено seed-версией из кода.\n\nТекущее меню сохранится в backup, но ручные правки в живом меню будут перезаписаны.\n\nЧтобы продолжить, введите фразу:\n${CONFIRMATION_PHRASE}`
      );

      if (enteredPhrase !== CONFIRMATION_PHRASE) {
        window.alert('Seed-импорт отменен. Фраза подтверждения не совпала.');
        return;
      }

      button.setAttribute(BYPASS_ATTRIBUTE, 'true');
      button.click();
    };

    syncHint();
    const observer = new MutationObserver(syncHint);
    observer.observe(document.body, { childList: true, subtree: true });
    document.addEventListener('click', handleClick, true);

    return () => {
      observer.disconnect();
      document.removeEventListener('click', handleClick, true);
    };
  }, []);

  return null;
}
