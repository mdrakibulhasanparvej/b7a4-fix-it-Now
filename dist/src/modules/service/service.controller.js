import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { serviceService } from "./service.service";
import httpStatus from "http-status";
const getAll = catchAsync(async (req, res) => {
    const { categoryId, minPrice, maxPrice, search } = req.query;
    const services = await serviceService.getAllServices({
        categoryId: categoryId,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        search: search,
    });
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Services fetched successfully",
        data: services,
    });
});
const getById = catchAsync(async (req, res) => {
    const service = await serviceService.getServiceById(req.params.id);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Service fetched successfully",
        data: service,
    });
});
const create = catchAsync(async (req, res) => {
    const service = await serviceService.createService({
        ...req.body,
        technicianId: req.user.id,
    });
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Service created successfully",
        data: service,
    });
});
const update = catchAsync(async (req, res) => {
    const service = await serviceService.updateService(req.params.id, req.user.id, req.body);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Service updated successfully",
        data: service,
    });
});
const remove = catchAsync(async (req, res) => {
    await serviceService.deleteService(req.params.id, req.user.id);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Service deleted successfully",
        data: null,
    });
});
export const serviceController = {
    getAll,
    getById,
    create,
    update,
    remove,
};
//# sourceMappingURL=service.controller.js.map