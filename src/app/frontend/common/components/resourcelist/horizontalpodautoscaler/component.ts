// Copyright 2017 The Kubernetes Authors.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {HttpParams} from '@angular/common/http';
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ComponentFactoryResolver, Input} from '@angular/core';
import {HorizontalPodAutoscaler, HorizontalPodAutoscalerList} from '@api/backendapi';
import {Observable} from 'rxjs/Observable';
import {ResourceListWithStatuses} from '../../../resources/list';
import {NotificationsService} from '../../../services/global/notifications';
import {EndpointManager, Resource} from '../../../services/resource/endpoint';
import {NamespacedResourceService} from '../../../services/resource/resource';
import {MenuComponent} from '../../list/column/menu/component';
import {ListGroupIdentifier, ListIdentifier} from '../groupids';

@Component({
  selector: 'kd-horizontal-pod-autoscaler-list',
  templateUrl: './template.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HorizontalPodAutoscalerListComponent extends ResourceListWithStatuses<
  HorizontalPodAutoscalerList,
  HorizontalPodAutoscaler
> {
  @Input() endpoint = EndpointManager.resource(Resource.horizontalPodAutoscaler, true).list();

  constructor(
    private readonly horizontalpodautoscaler_: NamespacedResourceService<HorizontalPodAutoscalerList>,
    notifications: NotificationsService,
    resolver: ComponentFactoryResolver,
    cdr: ChangeDetectorRef,
  ) {
    super('horizontalpodautoscaler', notifications, cdr, resolver);
    this.id = ListIdentifier.horizontalpodautoscaler;
    this.groupId = ListGroupIdentifier.workloads;

    // Register action columns.
    this.registerActionColumn<MenuComponent>('menu', MenuComponent);

    // Register dynamic columns.
    this.registerDynamicColumn('namespace', 'name', this.shouldShowNamespaceColumn_.bind(this));
  }

  getResourceObservable(params?: HttpParams): Observable<HorizontalPodAutoscalerList> {
    return this.horizontalpodautoscaler_.get(this.endpoint, undefined, undefined, params);
  }

  map(horizontalPodAutoscalerList: HorizontalPodAutoscalerList): HorizontalPodAutoscaler[] {
    return horizontalPodAutoscalerList.horizontalpodautoscalers;
  }

  getDisplayColumns(): string[] {
    return ['name', 'minpods', 'maxpods', 'scaletargetref', 'created'];
  }

  private shouldShowNamespaceColumn_(): boolean {
    return this.namespaceService_.areMultipleNamespacesSelected();
  }
}
