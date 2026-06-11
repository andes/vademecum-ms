import { VademecumRepository } from './vademecum.repository';
import { VademecumService } from './vademecum.service';
import { VademecumController } from './vademecum.controller';

const repository = new VademecumRepository();
const service = new VademecumService(repository);
const controller = new VademecumController(service);

export { controller as vademecumController };
export { VademecumController, VademecumService, VademecumRepository };
