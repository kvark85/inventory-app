import {
  CreateItemParams,
  DeleteItemParams,
  GetItemParams,
  Item,
  ItemRestClientHelper,
  UpdateItemParams,
} from './ItemRestClientHelper';
import {bind, Either, error, success} from '../fp';
import {
  GENERAL_REST_CLIENT_ERROR,
  GlobalError,
  PROJECT_NOT_SELECTED,
} from '../Error';

import {ProjectStore} from '../ProjectStore';
import {ErrorRepository} from '../ErrorRepository';
import {ServerItem, ItemRestClient} from '../ItemRestClient';
import {ProjectId} from '../HadesServer';
import {Configuration} from '../Configuration';
import {Uri} from '../units';
import {nanoid} from 'nanoid';
import {Json, JsonSerializable} from '../Json';
import {Platform} from 'react-native';
import {last} from 'lodash';

export default class ItemRestClientHelperImpl implements ItemRestClientHelper {
  constructor(
    private readonly _root: {
      readonly itemRestClient: ItemRestClient;
      readonly projectStore: ProjectStore;
      readonly errorRepository: ErrorRepository;
      readonly configuration: Configuration;
      readonly json: Json;
    },
  ) {}

  private _getProjectId(): Either<ProjectId, GlobalError> {
    const {selectedProject} = this._root.projectStore;
    if (selectedProject === undefined) {
      return error(
        this._root.errorRepository.create({kind: PROJECT_NOT_SELECTED}),
      );
    }
    return success(selectedProject.id);
  }

  private _createImageUri(str: string): Uri {
    const separator = '/';
    const replace = new RegExp(separator + '{1,}', 'g');
    return [this._root.configuration.values.shadesRestApiUrl, str]
      .join(separator)
      .replace(replace, separator) as Uri;
  }

  private _createImageBlog(uri: Uri) {
    const format = last(uri.split('.'));
    const end = format ? `.${format}` : format;
    const name = nanoid() + end;
    const imageUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
    return {
      uri: imageUri as Uri,
      name: name,
      type: 'image/jpeg',
    };
  }

  private _createCustomField(fields: JsonSerializable | undefined) {
    let customFields;
    if (fields) {
      const stringify_ = this._root.json.stringify(fields);
      if (stringify_.success) {
        customFields = stringify_.right;
      }
    }
    return customFields;
  }

  private _translateItemResponse = bind((item: ServerItem): Item => {
    return {
      id: item.id,
      brand: item.brand || undefined,
      employee: item.employee || undefined,
      image: item.image ? this._createImageUri(item.image) : undefined,
      model: item.model || undefined,
      name: item.name,
      project: item.project || undefined,
      qrKey: item.qr_key || undefined,
      serialNumber: item.serial_number || undefined,
      customFields: item.custom_field || undefined,
    };
  }, this);

  async create({item}: CreateItemParams) {
    const projectId_ = this._getProjectId();
    if (!projectId_.success) {
      return error(projectId_.left);
    }

    return this._root.itemRestClient.create({
      project_id: projectId_.right,
      item: {
        name: item.name,
        serial_number: item.serialNumber,
        image: item.image ? this._createImageBlog(item.image) : undefined,
        custom_field: this._createCustomField(item.customFields),
      },
    });
  }

  async get(params: GetItemParams) {
    const projectId_ = this._getProjectId();
    if (!projectId_.success) {
      return projectId_;
    }
    return this._root.itemRestClient
      .get({
        project_id: projectId_.right,
        id: params.id,
      })
      .then(response =>
        response.success
          ? success(this._translateItemResponse(response.right))
          : response,
      );
  }

  async getAll() {
    const projectId_ = this._getProjectId();
    if (!projectId_.success) {
      return projectId_;
    }
    return this._root.itemRestClient
      .getAll({project_id: projectId_.right})
      .then(response => {
        if (!response.success) {
          const isNotFound =
            response.left.kind === GENERAL_REST_CLIENT_ERROR &&
            response.left.statusCode === 404;
          if (isNotFound) {
            return success([]);
          }
          return response;
        }
        return success(response.right.map(this._translateItemResponse));
      });
  }

  async delete(params: DeleteItemParams) {
    const projectId_ = this._getProjectId();
    if (!projectId_.success) {
      return projectId_;
    }
    return this._root.itemRestClient.delete({
      project_id: projectId_.right,
      id: params.id,
    });
  }

  async update({id, item}: UpdateItemParams) {
    const projectId_ = this._getProjectId();
    if (!projectId_.success) {
      return projectId_;
    }
    return this._root.itemRestClient.update({
      project_id: projectId_.right,
      id: id,
      item: {
        name: item.name,
        serial_number: item.serialNumber,
        image: item.image
          ? this._createImageBlog(item.image)
          : (item.image as null), // null or undefined
        custom_field: this._createCustomField(item.customFields),
      },
    });
  }
}
