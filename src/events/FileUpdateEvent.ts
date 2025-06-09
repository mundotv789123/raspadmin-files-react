import { FileDTO } from "@/services/models/files-model";
import EventEmitter from "events";

export type FileOpenEvent = {
  eventCalled: boolean
  file: FileDTO
}

const fileUpdateEvent = new EventEmitter();

export default fileUpdateEvent;