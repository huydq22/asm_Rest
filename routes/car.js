const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Kết nối MongoDB
const mongodb = 'mongodb+srv://whathe7a1234:HPZ6Ys1B7Ni4eqgp@cluster0.lwkaj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
mongoose
    .connect(mongodb, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected!'))
    .catch((err) => console.error('Connection error:', err));

// Định nghĩa Schema và Model cho ô tô
const carSchema = new mongoose.Schema({
    MaXe: { type: String, required: true, unique: true },
    TenHang: { type: String, required: true },
    NamST: { type: Number, required: true },
    GiaBan: { type: Number, required: true },
    Mota: { type: String, required: true },
});

const Car = mongoose.model('Car', carSchema);

// --- ROUTES ---
// Lấy danh sách xe
router.get('/cars', async (req, res) => {
    try {
        const cars = await Car.find();
        res.status(200).json(cars); // Trả về danh sách xe dưới dạng JSON
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Thêm xe mới
router.post('/cars', async (req, res) => {
    try {
        const { MaXe, TenHang, NamST, GiaBan, Mota } = req.body;

        // Kiểm tra dữ liệu cần thiết
        if (!MaXe || !TenHang || !NamST || !GiaBan || !Mota) {
            return res.status(400).json({ error: 'Thiếu dữ liệu cần thiết' });
        }

        const newCar = new Car({ MaXe, TenHang, NamST, GiaBan, Mota });
        const savedCar = await newCar.save(); // Lưu vào MongoDB
        res.status(201).json(savedCar);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.get('/api/cars', async (req, res) => {
    try {
        const cars = await Car.find();
        res.json(cars); // Trả về dữ liệu JSON cho danh sách ô tô
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Cập nhật thông tin xe
router.put('/cars/:id', async (req, res) => {
    try {
        const updatedCar = await Car.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!updatedCar) {
            return res.status(404).json({ error: 'Xe không tồn tại' });
        }
        res.status(200).json(updatedCar);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Xóa xe
router.delete('/cars/:id', async (req, res) => {
    try {
        const deletedCar = await Car.findByIdAndDelete(req.params.id);
        if (!deletedCar) {
            return res.status(404).json({ error: 'Xe không tồn tại' });
        }
        res.status(204).send(); // Trả về trạng thái thành công không có nội dung
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
