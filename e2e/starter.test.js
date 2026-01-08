describe('Home Screen', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should show the "Good evening" header', async () => {
    await expect(element(by.text('Good evening'))).toBeVisible();
  });

  it('should show the "Portfolio" card', async () => {
    // Assuming PortfolioCard has some unique text or ID. 
    // Ideally we add testID="portfolio-card" to the component.
    await expect(element(by.text('$12,430.55'))).toBeVisible(); 
  });
});
