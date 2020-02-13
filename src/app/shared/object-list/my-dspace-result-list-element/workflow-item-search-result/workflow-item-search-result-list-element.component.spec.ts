import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { cold } from 'jasmine-marbles';

import { of as observableOf } from 'rxjs';
import { LinkService } from '../../../../core/cache/builders/link.service';
import { ItemDataService } from '../../../../core/data/item-data.service';

import { Item } from '../../../../core/shared/item.model';
import { WorkflowItem } from '../../../../core/submission/models/workflowitem.model';
import { MyDspaceItemStatusType } from '../../../object-collection/shared/mydspace-item-status/my-dspace-item-status-type';
import { WorkflowItemSearchResult } from '../../../object-collection/shared/workflow-item-search-result.model';
import { createSuccessfulRemoteDataObject } from '../../../testing/utils';
import { TruncatableService } from '../../../truncatable/truncatable.service';
import { WorkflowItemSearchResultListElementComponent } from './workflow-item-search-result-list-element.component';

let component: WorkflowItemSearchResultListElementComponent;
let fixture: ComponentFixture<WorkflowItemSearchResultListElementComponent>;

const compIndex = 1;

const mockResultObject: WorkflowItemSearchResult = new WorkflowItemSearchResult();
mockResultObject.hitHighlights = {};

const item = Object.assign(new Item(), {
  bundles: observableOf({}),
  metadata: {
    'dc.title': [
      {
        language: 'en_US',
        value: 'This is just another title'
      }
    ],
    'dc.type': [
      {
        language: null,
        value: 'Article'
      }
    ],
    'dc.contributor.author': [
      {
        language: 'en_US',
        value: 'Smith, Donald'
      }
    ],
    'dc.date.issued': [
      {
        language: null,
        value: '2015-06-26'
      }
    ]
  }
});
const rd = createSuccessfulRemoteDataObject(item);
mockResultObject.indexableObject = Object.assign(new WorkflowItem(), { item: observableOf(rd) });

let linkService;

describe('WorkflowItemSearchResultListElementComponent', () => {
  beforeEach(async(() => {
    linkService = {
      resolveLink() {
        // mock
      },
    };
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule],
      declarations: [WorkflowItemSearchResultListElementComponent],
      providers: [
        { provide: TruncatableService, useValue: {} },
        { provide: ItemDataService, useValue: {} },
        { provide: LinkService, useValue: linkService },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(WorkflowItemSearchResultListElementComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(WorkflowItemSearchResultListElementComponent);
    component = fixture.componentInstance;
  }));

  beforeEach(() => {
    component.dso = mockResultObject.indexableObject;
    fixture.detectChanges();
  });

  it('should init item properly', () => {
    expect(component.item$).toBeObservable(cold('a',{a: item}));
  });

  it('should have properly status', () => {
    expect(component.status).toEqual(MyDspaceItemStatusType.WORKFLOW);
  });
});
