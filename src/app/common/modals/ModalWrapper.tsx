import { ReactNode } from 'react'
import { Modal, ModalProps } from 'semantic-ui-react'
import { useAppDispatch, useAppSelector } from '../../store/store'
import { closeModal } from './modalSlice'

type Props = {
    children: ReactNode
    header?: string
} & ModalProps

export default function ModalWrapper({ children, header, ...props }: Props) {
    const { open } = useAppSelector(state => state.modals);
    const dispatch = useAppDispatch();

    return (
        <Modal open={open} size={props.size} onClose={() => dispatch(closeModal())}>
            {header && <Modal.Header>{header}</Modal.Header>}
            <Modal.Content>
                {children}
            </Modal.Content>
        </Modal>
    )
}