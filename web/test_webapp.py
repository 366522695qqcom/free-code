#!/usr/bin/env python3
"""Playwright test script for Claude Code Web UI.
Tests 3 pages: Workspace, Sessions, Settings.
Captures screenshots, verifies DOM elements, tests interactions.
"""

from playwright.sync_api import sync_playwright
import sys

BASE_URL = "http://localhost:5173"

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1440, "height": 900})

        # ═══════════════════════════════════════════
        # 1. Workspace Page Test
        # ═══════════════════════════════════════════
        print("=" * 60)
        print("Testing Workspace page (/)")
        print("=" * 60)

        page.goto(f"{BASE_URL}/")
        page.wait_for_load_state("networkidle")
        page.screenshot(path="/tmp/workspace.png", full_page=False)
        print("  Screenshot: /tmp/workspace.png")

        # Verify key elements exist
        elements = {
            "Titlebar": ".ds-wbtitlebar",
            "ActivityRail": ".ds-activityrail",
            "Sidebar": ".cc-sidebar",
            "EditorArea": ".cc-editor-area",
            "ChatPanel": ".cc-chat-panel",
            "StatusBar": ".ds-statusbar",
        }
        all_ok = True
        for name, selector in elements.items():
            count = page.locator(selector).count()
            status = "✅" if count > 0 else "❌"
            if count == 0:
                all_ok = False
            print(f"  {status} {name}: {count} found ({selector})")

        # Test: click sidebar toggle
        print("\n  Testing sidebar toggle...")
        sidebar_before = page.locator(".cc-sidebar").count()
        toggle_btn = page.locator(".ds-wbtitlebar button").first
        if toggle_btn.count() > 0:
            toggle_btn.click()
            page.wait_for_timeout(500)
            sidebar_after = page.locator(".cc-sidebar").count()
            print(f"    Sidebar before: {sidebar_before}, after toggle: {sidebar_after}")
        else:
            print("    No toggle button found")

        # Test: Activity Rail button click
        print("\n  Testing activity rail buttons...")
        rail_buttons = page.locator(".ds-activityrail button")
        rail_count = rail_buttons.count()
        print(f"    Found {rail_count} rail buttons")
        if rail_count > 1:
            rail_buttons.nth(1).click()
            page.wait_for_timeout(300)
            print("    Clicked 2nd rail button OK")

        print("\n  Workspace test PASSED ✅" if all_ok else "\n  Workspace test has issues ❌")

        # ═══════════════════════════════════════════
        # 2. Sessions Page Test
        # ═══════════════════════════════════════════
        print("\n" + "=" * 60)
        print("Testing Sessions page (/sessions)")
        print("=" * 60)

        page.goto(f"{BASE_URL}/sessions")
        page.wait_for_load_state("networkidle")
        page.screenshot(path="/tmp/sessions.png", full_page=False)
        print("  Screenshot: /tmp/sessions.png")

        session_elements = {
            "PageHead": ".ds-pagehead",
            "Tabs": ".ds-tabs",
            "Card": ".ds-card",
        }
        for name, selector in session_elements.items():
            count = page.locator(selector).count()
            status = "✅" if count > 0 else "❌"
            print(f"  {status} {name}: {count} found")

        # Test: click tabs
        print("\n  Testing tab switching...")
        tabs = page.locator(".ds-tabs button, .ds-tabs [role=tab], .ds-tabs a")
        tab_count = tabs.count()
        print(f"    Found {tab_count} tabs")
        if tab_count > 1:
            tabs.nth(1).click()
            page.wait_for_timeout(300)
            print("    Clicked 2nd tab OK")

        # Test: New Session button
        print("\n  Testing New Session modal...")
        new_btn = page.locator("text=New Session")
        if new_btn.count() > 0:
            new_btn.first.click()
            page.wait_for_timeout(500)
            modal = page.locator(".ds-dialog")
            modal_count = modal.count()
            print(f"    Modal appeared: {'✅' if modal_count > 0 else '❌'} ({modal_count})")
            page.screenshot(path="/tmp/sessions_modal.png")
            print("    Screenshot: /tmp/sessions_modal.png")
        else:
            print("    New Session button not found")

        print("\n  Sessions test DONE ✅")

        # ═══════════════════════════════════════════
        # 3. Settings Page Test
        # ═══════════════════════════════════════════
        print("\n" + "=" * 60)
        print("Testing Settings page (/settings)")
        print("=" * 60)

        page.goto(f"{BASE_URL}/settings")
        page.wait_for_load_state("networkidle")
        page.screenshot(path="/tmp/settings.png", full_page=False)
        print("  Screenshot: /tmp/settings.png")

        settings_elements = {
            "NavList": ".ds-navlist",
            "SettingRow": ".ds-settingrow",
        }
        for name, selector in settings_elements.items():
            count = page.locator(selector).count()
            status = "✅" if count > 0 else "❌"
            print(f"  {status} {name}: {count} found")

        # Test: click nav item
        print("\n  Testing nav switching...")
        nav_items = page.locator(".ds-navlist button, .ds-navlist a, .ds-navlist li")
        nav_count = nav_items.count()
        print(f"    Found {nav_count} nav items")
        if nav_count > 2:
            nav_items.nth(2).click()
            page.wait_for_timeout(300)
            print("    Clicked 3rd nav item OK")

        print("\n  Settings test DONE ✅")

        # ═══════════════════════════════════════════
        # 4. Responsive Tests
        # ═══════════════════════════════════════════
        print("\n" + "=" * 60)
        print("Testing Responsive Layouts")
        print("=" * 60)

        # Tablet: 1024x768
        page.set_viewport_size({"width": 1024, "height": 768})
        page.goto(f"{BASE_URL}/")
        page.wait_for_load_state("networkidle")
        page.wait_for_timeout(500)
        page.screenshot(path="/tmp/workspace_tablet.png")
        print("  Tablet (1024x768): /tmp/workspace_tablet.png ✅")

        # Mobile: 375x812
        page.set_viewport_size({"width": 375, "height": 812})
        page.wait_for_timeout(500)
        page.screenshot(path="/tmp/workspace_mobile.png")
        print("  Mobile (375x812): /tmp/workspace_mobile.png ✅")

        # Mobile Sessions
        page.goto(f"{BASE_URL}/sessions")
        page.wait_for_load_state("networkidle")
        page.wait_for_timeout(500)
        page.screenshot(path="/tmp/sessions_mobile.png")
        print("  Mobile Sessions: /tmp/sessions_mobile.png ✅")

        browser.close()

        print("\n" + "=" * 60)
        print("ALL TESTS COMPLETED ✅")
        print("=" * 60)
        print("\nScreenshots generated:")
        print("  /tmp/workspace.png         - Desktop Workspace")
        print("  /tmp/sessions.png          - Desktop Sessions")
        print("  /tmp/sessions_modal.png    - Sessions Modal")
        print("  /tmp/settings.png          - Desktop Settings")
        print("  /tmp/workspace_tablet.png   - Tablet Workspace")
        print("  /tmp/workspace_mobile.png   - Mobile Workspace")
        print("  /tmp/sessions_mobile.png   - Mobile Sessions")

if __name__ == "__main__":
    main()
