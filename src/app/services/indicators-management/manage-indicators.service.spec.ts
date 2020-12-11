

import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ManageIndicatorsService } from './manage-indicators.service';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { HttpResponse } from '@angular/common/http';
import { IndicatorDto } from '../../manage-indicators/utils/indicator.dto';
import { environment } from '../../../environments/environment';
import { FilterDto } from '../dto/filter.dto';
import { Sort } from 'src/app/manage-indicators/utils/sort';
import { PageDto } from 'src/app/manage-indicators/utils/page.dto';

describe('ManageIndicatorsService', () => {
  let manageIndicatorsService: ManageIndicatorsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        NzMessageModule
      ],
      providers: [
        ManageIndicatorsService
      ],
    });

    manageIndicatorsService = TestBed.inject(ManageIndicatorsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(manageIndicatorsService).toBeTruthy();
  });

  it('should be retrieve indicators', () => {
    const page = 1;
    const pageSize = 50;
    const filter = new FilterDto();
    filter.sector = ['Poverty'];
    const sortBy = null;
    const httpResponse = new HttpResponse<PageDto<IndicatorDto>>();
    manageIndicatorsService.getIndicators(page, pageSize, filter, sortBy)
      .subscribe((response: HttpResponse<PageDto<IndicatorDto>>) => {
        // expect(response).toBe(httpResponse);
    });
    let req = httpMock.expectOne(environment.apiBaseUrl + '/indicators?' +
          `page=${page}&pageSize=${pageSize}&`+ 
          `filters.sectors=${filter.sector}&filters.indicatorName=`);
    expect(req.request.method).toBe('GET');
    req.flush(httpResponse);
    httpMock.verify();
  });

  it('should delete indicator and return it', inject([HttpTestingController], (httpClient: HttpTestingController) => {
    const indicator: IndicatorDto = new IndicatorDto();
    manageIndicatorsService.deleteIndicator(1)
      .subscribe((response: IndicatorDto) => {
        expect(response).toBe(indicator);
    });
    let req = httpMock.expectOne(environment.apiBaseUrl + '/indicators/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(indicator);
    httpMock.verify();
  }));

  it('should update indicator as updated for similarity check', inject([HttpTestingController], (httpClient: HttpTestingController) => {
    const indicator: IndicatorDto = new IndicatorDto();
    manageIndicatorsService.similarityCheckIndicator(1)
      .subscribe((response: IndicatorDto) => {
        expect(response).toBe(indicator);
    });
    let req = httpMock.expectOne(environment.apiBaseUrl + '/indicators/similarity/1');
    expect(req.request.method).toBe('PUT');
    req.flush(indicator);
    httpMock.verify();
  }));

  it('should delete indicator and return it', inject([HttpTestingController], (httpClient: HttpTestingController) => {
    const indicator: IndicatorDto = new IndicatorDto();
    manageIndicatorsService.deleteIndicator(1)
      .subscribe((response: IndicatorDto) => {
        expect(response).toBe(indicator);
    });
    let req = httpMock.expectOne(environment.apiBaseUrl + '/indicators/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(indicator);
    httpMock.verify();
  }));
});