import React, { useEffect, useState } from 'react';
import { Button, Checkbox, Select, SelectItem } from '@nextui-org/react';
import { useToast } from '@/hooks/useToast';
import store from '@/adminRedux/store';
import { UPDATE_ITEM } from '@/adminRedux/action/currentTable';
import { RootState } from '@/adminRedux/reducers';
import { useSelector } from 'react-redux';
import { OrderType, PurchaseOrderType } from 'types/order';
import { tw } from '@/ultis/tailwind.ultis';

interface DepositManagementProps {
	_id: string;
}

enum Status {
	isPaid = 'Đã thanh toán',
	isNotPaid = 'Chưa thanh toán',
}

enum confirmStatus {
	isConfirmed = 'Đã xác nhận',
	isNotConfirmed = 'Chưa xác nhận',
}

enum PaymentMethod {
	balance = 'Tài khoản chính',
	virtualVolume = 'Tài khoản nợ',
}

function DepositManagement({ _id }: DepositManagementProps) {
	const currentTable = useSelector((state: RootState) => state.currentTable.currentTable);
	const { error, success } = useToast();
	const [status, setStatus] = React.useState<keyof typeof Status>('isNotPaid');
	const [confirm, setConfirm] = React.useState<keyof typeof confirmStatus>('isNotConfirmed');
	const [isUpdating, setIsUpdating] = React.useState<boolean>(false);
	const [isDeleting, setIsDeleting] = React.useState<boolean>(false);
	const [paymentMethod, setPaymentMethod] = useState<keyof typeof PaymentMethod>('balance');
	const [confirmChange, setConfirmChange] = useState<boolean>(false);
	const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		//@ts-ignore
		setStatus(e.target.value);
		// console.log(status)
	};
	const handleConfirmSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		//@ts-ignore
		setConfirm(e.target.value);
		// console.log(status)
	};
	const handleUpdate = async () => {
		// console.log(status);
		if (!confirmChange)
			return error('Vui lòng xác nhận thay đổi đơn hàng trước khi thực hiện thay đổi.');
		setIsUpdating(true);
		const response = await fetch('/api/v1/admin/deposit/update-deposit', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				depositId: _id,
				status: {
					isPaid: status === 'isPaid',
					confirmed: confirm === 'isConfirmed',
				},
			}),
		});
		const responseData = await response.json();
		if (response.status === 200) {
			success(responseData.message);
			setIsUpdating(false);
			store.dispatch({
				type: 'UPDATE_ITEM',
				payload: {
					_id,
					isPaid: status === 'isPaid',
					confirmed: confirm === 'isConfirmed',
				},
			});
		} else {
			error(responseData.error);
			setIsUpdating(false);
		}
	};

	useEffect(() => {
		const tableItem = currentTable.find(item => item._id === _id) as PurchaseOrderType;
		setStatus(tableItem.isPaid ? 'isPaid' : 'isNotPaid');
		setConfirm(tableItem.confirmed ? 'isConfirmed' : 'isNotConfirmed');
		setPaymentMethod(tableItem.type);
	}, [currentTable]);

	return (
		<div className={'flex flex-col justify-center items-center gap-4'}>
			<div className={'w-full flex flex-col justify-center items-center gap-2 p-4'}>
				<div className={'flex justify-center items-center gap-2'}>
					<span className={'text-lg font-bold'}>Loại tài khoản</span>
					<span
						className={tw(
							'text-lg font-bold ',
							paymentMethod === 'balance' ? 'text-green-500' : 'text-danger-500',
						)}>
						{PaymentMethod[paymentMethod as keyof typeof PaymentMethod]}
					</span>
				</div>
				<Select
					items={Object.keys(Status).map(key => ({
						value: key,
						label: Status[key as keyof typeof Status],
					}))}
					selectedKeys={[status]}
					label='Trạng thái'
					// placeholder=""
					className='max-w-xs'
					onChange={handleSelectionChange}
					variant={'bordered'}
					color={'primary'}
					showScrollIndicators={true}>
					{covan => (
						<SelectItem key={covan.value} value={covan.value}>
							{covan.label}
						</SelectItem>
					)}
				</Select>
				<Select
					items={Object.keys(confirmStatus).map(key => ({
						value: key,
						label: confirmStatus[key as keyof typeof confirmStatus],
					}))}
					selectedKeys={[confirm]}
					label='Xác nhận'
					// placeholder=""
					className='max-w-xs'
					onChange={handleConfirmSelectionChange}
					variant={'bordered'}
					color={'primary'}
					showScrollIndicators={true}>
					{covan => (
						<SelectItem key={covan.value} value={covan.value}>
							{covan.label}
						</SelectItem>
					)}
				</Select>
				<div className={'flex justify-center items-center gap-1'}>
					<Checkbox
						type={'checkbox'}
						isSelected={confirmChange}
						onValueChange={e => {
							// console.log(e);
							setConfirmChange(e);
						}}
					/>
					<p>Xác nhận thay đổi đơn hàng</p>
				</div>
				<div className={'text-xs italic flex flex-wrap gap-1 max-w-md'}>
					{'Việc xác nhận thay đổi trạng thái đơn hàng chỉ được phép thực hiện'
						.split(' ')
						.map(word => (
							<p>{word}</p>
						))}
					<p className={'text-red-500 w-fit'}>1</p>
					{'lần để đảm bảo tính chất bảo mật của hệ thống và quá trình làm việc thuận lợi hơn.'
						.split(' ')
						.map(word => (
							<p>{word}</p>
						))}
				</div>
			</div>
			<div className={'flex flex-row gap-2 mt-2'}>
				<Button className={'bg-blue-600 text-white'} disabled={isUpdating} onClick={handleUpdate}>
					Lưu
				</Button>
				<Button className={'bg-red-500 text-white'} disabled={isDeleting} onClick={() => {}}>
					Xóa
				</Button>
			</div>
		</div>
	);
}

export default DepositManagement;
