import express from 'express';
import { addPinyin } from './chinese.controller';

export const router = express.Router();

router.post('/', addPinyin);
