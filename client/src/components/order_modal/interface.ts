import { Order } from "../../pages/orders/interface";

export interface OderFormModalProps {
  OpenOrderModal: boolean;
  handleClose: () => void;
  orderData: Order;
}
