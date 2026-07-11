import Reservation from './reservation.model.js';
import Table from '../table/table.model.js';

const getTableStatus = (time_reservation) => {
    const now = new Date();
    const reservationDate = new Date(time_reservation);
    const sameDay =
        reservationDate.getFullYear() === now.getFullYear() &&
        reservationDate.getMonth() === now.getMonth() &&
        reservationDate.getDate() === now.getDate();
    return sameDay ? 'ocupada' : 'reservada';
};

export const createReservationRecord = async ({ reservationData }) => {
    const data = { ...reservationData };
    const reservation = new Reservation(data);
    await reservation.save();

    const newStatus = getTableStatus(data.time_reservation);
    await Table.findByIdAndUpdate(data.table, { status: newStatus });

    return reservation;
};

export const fetchReservation = async ({
    page = 1,
    limit = 10,
    isActive = true,
}) => {
    const filter = { isActive };
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    const reservations = await Reservation.find(filter)
        .populate('table', 'number capacity status')
        .populate('restaurant', 'name address phone')
        .limit(limitNumber * 1)
        .skip((pageNumber - 1) * limitNumber)
        .sort({ createdAt: -1 });

    const total = await Reservation.countDocuments(filter);

    return {
        reservations,
        pagination: {
            currentPage: pageNumber,
            totalPages: Math.ceil(total / limitNumber),
            totalRecords: total,
            limit: limitNumber,
        },
    };
};

export const deleteReservation = async (id) => {
    const reservation = await Reservation.findByIdAndUpdate(
        id,
        { isActive: false },
        { new: true }
    );

    if (reservation?.table) {
        const active = await Reservation.findOne({
            table: reservation.table,
            isActive: true,
        });
        if (!active) {
            await Table.findByIdAndUpdate(reservation.table, { status: 'disponible' });
        }
    }

    return reservation;
};

export const restoreReservation = async (id) => {
    const reservation = await Reservation.findByIdAndUpdate(
        id,
        { isActive: true },
        { new: true }
    );

    if (reservation?.table) {
        const newStatus = getTableStatus(reservation.time_reservation);
        await Table.findByIdAndUpdate(reservation.table, { status: newStatus });
    }

    return reservation;
};