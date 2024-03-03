export const openModal = (id: string) =>
  (
    document.getElementById(id) as HTMLElement & {
      showModal: Function;
    }
  )?.showModal();

export const closeModal = (id: string) =>
  (
    document.getElementById(id) as HTMLElement & {
      close: Function;
    }
  )?.close();
